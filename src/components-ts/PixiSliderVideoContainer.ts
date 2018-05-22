import { SignalDispatcher, SimpleEventDispatcher } from "strongly-typed-events";
import * as PIXI from "pixi.js";
import PixelSortingFilter from '../shaders/pixelsorting/PixelSortingFilter';
import { TweenLite, Power4 } from "gsap";

export default class PixiSliderVideoContainer extends PIXI.Container {
    private _onDragStartEvent = new SignalDispatcher();
    private _onProjectClickedEvent = new SimpleEventDispatcher<number>();
    private _onDragEndEvent = new SimpleEventDispatcher<number>();
    private _onDragUpdateEvent = new SimpleEventDispatcher<number>();

    private animationRequestId: number;

    private dragging: any = false;
    private dragData: any;
    private dragMaxVelocity: number = 15;
    private dragVelocity: number = 0;
    private beforeDragPosX: number = 0;
    private dragAmount: number = 0;
    private dragDirection: number = 0;
    private dragTween: TweenLite;
    private domVideoElement: HTMLVideoElement;

    private app: PIXI.Application;
    private shader: PixelSortingFilter;
    private lastProjectIndex: number;
    private currentProjectIndex: number;
    private projectIndexToGo: number;
    private screenHalfWidth: number;
    private screenWidth: number;
    private screenHeight: number;
    private screenRatio: number;
    private mediaRatio: number;
    private videoTexture: PIXI.Texture;
    private screenTextureWidth: number;
    private screenTextureHeight: number;


    constructor(app: PIXI.Application, projects: Array<any>, domVideoElement: HTMLVideoElement) {
        super();
        this.app = app;
        this.domVideoElement = domVideoElement;
        this.lastProjectIndex = projects.length - 1;
        this.screenWidth = this.app.screen.width;
        this.screenHeight = this.app.screen.height;
        this.screenRatio = this.screenWidth / this.screenHeight;
        this.screenHalfWidth = this.app.screen.width * 0.5;
        this.dragTween = new TweenLite(this, 0.1, {});

        this.videoTexture = PIXI.Texture.fromVideo(domVideoElement);
        (<PIXI.VideoBaseTexture>this.videoTexture.baseTexture).autoPlay = true;
        (<PIXI.VideoBaseTexture>this.videoTexture.baseTexture).autoUpdate = true;
        this.screenTextureWidth = this.videoTexture.width / projects.length;
        this.screenTextureHeight = this.videoTexture.height;
        this.mediaRatio = this.screenTextureWidth / this.screenTextureHeight;
        
        for (var i = 0; i < projects.length; i++) {
            let frame: PIXI.Rectangle = this.getVideoTextureRect(i);
            let projectTexture = new PIXI.Texture(this.videoTexture.baseTexture, frame);
            let projectSprite = new PIXI.Sprite(projectTexture);
            projectSprite.position.x = this.screenWidth * 0.5 + i * this.screenWidth;
            projectSprite.anchor.x = 0.5;
            projectSprite.position.y = this.screenHeight * 0.5;
            projectSprite.anchor.y = 0.5;
            projectSprite.width = this.screenWidth;
            projectSprite.height = this.screenHeight;
            this.addChild(projectSprite);
        }

        this.videoTexture.destroy();
        this.initShader();
        this.currentProjectIndex = 0;
        this.projectIndexToGo = 0;
        this.createDragAndDropFor();
    }

    public get onDragStartEvent() {
        return this._onDragStartEvent.asEvent();
    }

    public get onProjectClickedEvent() {
        return this._onProjectClickedEvent.asEvent();
    }

    public get onDragEndEvent() {
        return this._onDragEndEvent.asEvent();
    }

    public get onDragUpdateEvent() {
        return this._onDragUpdateEvent.asEvent();
    }

    private getVideoTextureRect(projectIndex: number): PIXI.Rectangle {
        
        let cropTextureWidth: number;
        let cropTextureHeight: number;
        let cropTextureOffset: PIXI.Point = new PIXI.Point();

        if( this.screenRatio > this.mediaRatio) {
            cropTextureWidth = this.screenTextureWidth;
            cropTextureHeight = cropTextureWidth / this.screenRatio;
        } else {
            cropTextureHeight = this.screenTextureHeight;
            cropTextureWidth = cropTextureHeight * this.screenRatio;
        }
        cropTextureOffset.x = (this.screenTextureWidth - cropTextureWidth) * 0.5;
        cropTextureOffset.y = (this.screenTextureHeight - cropTextureHeight) * 0.5;

        return new PIXI.Rectangle((projectIndex * this.screenTextureWidth) + cropTextureOffset.x, cropTextureOffset.y, cropTextureWidth, cropTextureHeight);
    }

    private initShader(): void {
        this.shader = new PixelSortingFilter(0);
        this.shader.uniforms.iResolution = [this.app.screen.width, this.app.screen.height];
        this.app.stage.filters = [this.shader];
        this.app.ticker.add(delta => {
            this.shader.time += 0.01;
        });
    }

    private createDragAndDropFor() {
        this.interactive = true;
        this.on("pointerdown", this.onDragStart);
        this.on("pointerup", this.onDragEnd);
        this.on("pointerupoutside", this.onDragEnd);
        this.on("pointermove", this.onDragUpdate);
    }

    private onDragStart(event: any): void {
        this._onDragStartEvent.dispatch();
        this.domVideoElement.pause();
        this.onAnimationUpdate();
        this.dragTween.kill();
        this.dragging = this;
        this.dragData = event.data;
        let position = this.dragData.getLocalPosition(this);
        this.pivot.set(position.x, position.y);
        this.position.set(this.dragData.global.x, this.dragData.global.y);
        this.beforeDragPosX = this.position.x;
        this.dragAmount = 0;
    }

    private onDragEnd(event: any): void {
        this.dragging = false;
        this.domVideoElement.play();
        if (this.dragAmount !== 0) {
            this.finishDrag();
        } else {
            this._onProjectClickedEvent.dispatch(this.currentProjectIndex);
        }
    }

    private onDragUpdate(event: any): void {
        if (this.dragging) {
            let newPos = this.dragData.getLocalPosition(this.parent).x;
            this.dragVelocity = Math.min(this.dragMaxVelocity, Math.abs(newPos - this.position.x));
            this.dragAmount = Math.abs(newPos - this.beforeDragPosX);
            this.dragDirection = ((newPos - this.beforeDragPosX) > 0) ? -1 : 1;

            if ((this.dragDirection === -1) && (this.currentProjectIndex === 0)) {
                this.position.x = this.beforeDragPosX + (0.1 * this.dragAmount);
            } else if ((this.dragDirection === 1) && (this.currentProjectIndex === this.lastProjectIndex)) {
                this.position.x = this.beforeDragPosX - (0.1 * this.dragAmount);
            } else {
                this.position.x = newPos;
            }
        }
    }

    private finishDrag() {
        this.computeClosestScreen();
    }

    private computeClosestScreen(): void {

        let positionToScreenCenter: number = Math.abs((this.position.x - this.pivot.x));
        let numberOfScreensLeftSide: number = Math.abs(Math.floor(positionToScreenCenter / this.screenWidth));
        let spaceBetweenLeftScreenAndCenter: number = (positionToScreenCenter % this.screenWidth) - this.screenHalfWidth;
        let spaceBetweenLeftScreenAndLeftBorder: number = Math.abs((positionToScreenCenter % this.screenWidth) - (this.screenWidth));

        let detectionArea: number = this.screenWidth - (this.screenHalfWidth + (this.screenHalfWidth * (this.dragVelocity / this.dragMaxVelocity)));
        let numberOfScreenToJump: number = Math.floor((this.dragAmount + this.screenHalfWidth) / this.screenWidth);
        numberOfScreenToJump = (numberOfScreenToJump < 1) ? 1 : numberOfScreenToJump;
        numberOfScreenToJump = numberOfScreenToJump * this.dragDirection;

        if (this.dragAmount > detectionArea) {
            if (((this.dragDirection === 1) && (this.currentProjectIndex < this.lastProjectIndex)) || ((this.dragDirection === -1) && (this.currentProjectIndex > 0))) {
                this.projectIndexToGo = this.currentProjectIndex + numberOfScreenToJump;
            }
        }
        this.dragAmount = 0;
        this.executeTween();
        this._onDragEndEvent.dispatch(this.currentProjectIndex);
    }

    private executeTween(): void {
        let positionToGoTo: number = -((this.projectIndexToGo) * this.screenWidth) + this.pivot.x;
        this.dragTween = TweenLite.to(this.position, 0.5, {
            x: positionToGoTo, ease: Power4.easeOut, onComplete: this.onTweenEnded
        });
        this.currentProjectIndex = this.projectIndexToGo;
    }

    private onTweenEnded = () => {
        cancelAnimationFrame(this.animationRequestId);
    }

    private onAnimationUpdate(): void {
        const handler = () => {
            this._onDragUpdateEvent.dispatch(this.position.x - this.pivot.x);
            this.shader.size = (this.dragAmount / this.app.screen.width) * -this.dragDirection;
            //console.log(this.shader.size);

            this.animationRequestId = window.requestAnimationFrame(handler);
        };
        this.animationRequestId = requestAnimationFrame(handler);
    }
}