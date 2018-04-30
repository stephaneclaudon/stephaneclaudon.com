import * as PIXI from "pixi.js";
import { TweenMax, Power4 } from "gsap";
//@ts-ignore
import * as PixiPlugin from "gsap/PixiPlugin";

export default class PixiSliderVideoContainer extends PIXI.Container {
    dragging: any = false;
    dragData: any;
    dragMaxVelocity: number = 15;
    dragVelocity: number = 0;
    beforeDragPosX: number = 0;
    dragAmount: number = 0;
    dragDirection: number = 0;
    dragTween: TweenMax;

    app: PIXI.Application;
    lastProjectIndex: number;
    currentProjectIndex: number;
    projectIndexToGo: number;
    screenHalfWidth: number;
    screenWidth: number;
    screenHeight: number;
    screenTextureWidth: number;

    constructor(app: PIXI.Application, projects: Array<any>, domVideoElement: HTMLVideoElement) {
        super();
        this.app = app;
        this.lastProjectIndex = projects.length - 1;
        this.screenWidth = this.app.screen.width;
        this.screenHeight = this.app.screen.height;
        this.screenHalfWidth = this.app.screen.width * 0.5;
        this.dragTween = new TweenMax(this, 0.1, {});
        
        for (var i = 0; i < 5; i++) {
            let startText: PIXI.Texture = PIXI.Texture.fromVideo(domVideoElement);
            (<PIXI.VideoBaseTexture>startText.baseTexture).autoPlay = true;
            (<PIXI.VideoBaseTexture>startText.baseTexture).autoUpdate = true;
            this.screenTextureWidth = startText.width / projects.length;
            let frame: PIXI.Rectangle = new PIXI.Rectangle(i * this.screenTextureWidth, 0, this.screenTextureWidth, startText.height);
            let projectTexture = new PIXI.Texture(startText.baseTexture, frame);
            startText.destroy();

            let projectSprite = new PIXI.Sprite(projectTexture);
            projectSprite.position.x = window.innerWidth * 0.5 + i * window.innerWidth;

            projectSprite.anchor.x = 0.5;
            projectSprite.position.y = window.innerHeight * 0.5;
            projectSprite.anchor.y = 0.5;

            projectSprite.width = window.innerWidth;
            projectSprite.height = window.innerHeight;

            this.addChild(projectSprite);
        }
        this.currentProjectIndex = 0;
        this.projectIndexToGo = 0;
        this.createDragAndDropFor();
    }

    createDragAndDropFor() {
        this.interactive = true;
        this.on("pointerdown", this.onDragStart);
        this.on("pointerup", this.onDragEnd);
        this.on("pointerupoutside", this.onDragEnd);
        this.on("pointermove", this.onDragUpdate);
    }

    onDragStart(event: any): void {
        this.dragTween.kill();
        this.dragging = this;
        this.dragData = event.data;
        let position = this.dragData.getLocalPosition(this);
        this.pivot.set(position.x, position.y);
        this.position.set(this.dragData.global.x, this.dragData.global.y);
        this.beforeDragPosX = this.position.x;
        this.dragAmount = 0;
    }

    onDragEnd(event: any): void {
        this.dragging = false;
        this.finishDrag();
    }

    onDragUpdate(event: any): void {
        if (this.dragging) {
            let newPos = this.dragData.getLocalPosition(this.parent).x;
            this.dragVelocity = Math.min(this.dragMaxVelocity, Math.abs(newPos - this.position.x));
            this.dragAmount = Math.abs(newPos - this.beforeDragPosX);
            this.dragDirection = ((newPos - this.beforeDragPosX) > 0)?-1:1;
            
            if((this.dragDirection === -1) && (this.currentProjectIndex === 0)){
                this.position.x = this.beforeDragPosX + (0.1 * this.dragAmount);
            }else if ((this.dragDirection === 1) && (this.currentProjectIndex === this.lastProjectIndex)){
                this.position.x = this.beforeDragPosX - (0.1 * this.dragAmount);
            } else {
                this.position.x = newPos;
            }
        }
    }

    finishDrag() {
        this.computeClosestScreen();
    }

    computeClosestScreen(): void {
        
        let positionToScreenCenter : number = Math.abs((this.position.x - this.pivot.x));
        let numberOfScreensLeftSide: number = Math.abs(Math.floor(positionToScreenCenter / this.screenWidth));
        let spaceBetweenLeftScreenAndCenter: number = (positionToScreenCenter % this.screenWidth) - this.screenHalfWidth;
        let spaceBetweenLeftScreenAndLeftBorder: number = Math.abs((positionToScreenCenter % this.screenWidth) - (this.screenWidth));

        let detectionArea: number = this.screenWidth - (this.screenHalfWidth + (this.screenHalfWidth * (this.dragVelocity / this.dragMaxVelocity)));
        let numberOfScreenToJump: number = Math.floor((this.dragAmount + this.screenHalfWidth) / this.screenWidth);
        numberOfScreenToJump = (numberOfScreenToJump < 1) ? 1 : numberOfScreenToJump;
        numberOfScreenToJump = numberOfScreenToJump * this.dragDirection;
        
        if(this.dragAmount > detectionArea){
            if(((this.dragDirection === 1) && (this.currentProjectIndex < this.lastProjectIndex)) || ((this.dragDirection === -1) && (this.currentProjectIndex > 0))){
                this.projectIndexToGo = this.currentProjectIndex + numberOfScreenToJump;
            }
        }
        
        this.executeTween();
    }

    executeTween(): void {
        let positionToGoTo: number = -((this.projectIndexToGo) * this.screenWidth) + this.pivot.x;
        this.dragTween = TweenMax.to(this.position, 0.5, {x: positionToGoTo, ease:Power4.easeOut});
        this.currentProjectIndex = this.projectIndexToGo;
    }
}