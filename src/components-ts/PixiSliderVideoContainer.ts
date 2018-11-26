import { EventDispatcher, SignalDispatcher, SimpleEventDispatcher } from "strongly-typed-events";
import * as PIXI from "pixi.js";
import PixelSortingFilter from '../shaders/pixelsorting/PixelSortingFilter';
import PixiSliderVideoItem from './PixiSliderVideoItem';
import { TweenLite, Power4 } from "gsap";
import store from "../store"
//@ts-ignore
import * as PixiPlugin from "gsap/PixiPlugin";

export default class PixiSliderVideoContainer extends PIXI.Container {
    private _onDragStartEvent = new SignalDispatcher();
    private _onProjectClickedEvent = new SimpleEventDispatcher<number>();
    private _onDragEndEvent = new SimpleEventDispatcher<number>();
    private _onDragUpdateEvent = new EventDispatcher<number, number>();

    private animationRequestId: any;

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
    private projectsCount: number;
    private lastProjectIndex: number;
    private previousProjectIndex: number;
    private currentProjectIndex: number;
    private projectIndexToGo: number;
    private screenHalfWidth: number;
    private screenWidth: number;
    private screenHeight: number;
    private screenRatio: number;
    private mediaRatio: number;
    private videoTexture: PIXI.Texture;
    private videoTextureSize: PIXI.Point;
    private videoTextureRatio: number;
    private screenTextureWidth: number;
    private screenTextureHeight: number;
    private videoItemList: Array<PixiSliderVideoItem> = [];


    constructor(app: PIXI.Application, projects: Array<any>, domVideoElement: HTMLVideoElement) {
      super();
      this.app = app;
      this.domVideoElement = domVideoElement;
      this.lastProjectIndex = projects.length - 1;
      this.projectsCount = projects.length;
      this.dragTween = new TweenLite(this, 0.1, {});

      this.videoTexture = PIXI.Texture.fromVideo(this.domVideoElement);
      this.videoTextureSize = new PIXI.Point(this.domVideoElement.videoWidth, this.domVideoElement.videoHeight);
      this.videoTextureRatio = this.videoTextureSize.x / this.videoTextureSize.y;
      (<PIXI.VideoBaseTexture>this.videoTexture.baseTexture).autoPlay = true;
      (<PIXI.VideoBaseTexture>this.videoTexture.baseTexture).autoUpdate = true;
      this.initScreenSizes();

      for (var i = 0; i < projects.length; i++) {
          let frame: PIXI.Rectangle = this.getVideoTextureRect(i);          
          let projectTexture = new PIXI.Texture(this.videoTexture.baseTexture, frame);
          let projectSprite = new PixiSliderVideoItem(i, projectTexture, this.screenWidth, this.screenHeight);          
          this.addChild(projectSprite);
          this.videoItemList.push(projectSprite);
      }

      this.videoTexture.destroy();
      //this.initShader();
      this.currentProjectIndex = 0;
      this.projectIndexToGo = 0;
      this.updateScreensRenderability();
      this.createDragAndDropFor();
    }

    public resizeTextures() :void {
      this.initScreenSizes();
      this.updateTexturesFrame();
      let positionToGoTo: number = -((this.projectIndexToGo) * this.screenWidth) + this.pivot.x;
      this.position.x = positionToGoTo;
    }

    private initScreenSizes(): void {
      this.screenWidth = this.app.screen.width;
      this.screenHeight = this.app.screen.height;
      
      this.screenRatio = this.screenWidth / this.screenHeight;
      this.screenHalfWidth = this.app.screen.width * 0.5;

      this.screenTextureWidth = (this.videoTextureRatio > 1) ? (this.videoTextureSize.x / this.projectsCount) : this.videoTextureSize.x;
      this.screenTextureHeight = (this.videoTextureRatio > 1) ? this.videoTextureSize.y : (this.videoTextureSize.y / this.projectsCount);
      this.mediaRatio = this.screenTextureWidth / this.screenTextureHeight;      
    }

    private updateTexturesFrame(): void {
      for (var i = 0; i < this.projectsCount; i++) {
        this.videoItemList[i].texture.frame = this.getVideoTextureRect(i);
        this.videoItemList[i].texture._updateUvs();
        this.videoItemList[i].updateInitialPosition(process.viewportSize.width, process.viewportSize.height);
      }
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
    }

    private onDragStart(event: any): void {
        //Make sure it's left button on mouse pointer
        if(event.data.pointerType !== "mouse" || (event.data.pointerType === "mouse" && event.data.button === 0)) {
            this.off("pointerdown", this.onDragStart);
            this.on("pointerup", this.onDragEnd);
            this.on("pointerupoutside", this.onDragEnd);
            this.on("pointermove", this.onDragUpdate);

            this._onDragStartEvent.dispatch();
            this.domVideoElement.pause();
            this.dragTween.kill();
            this.dragData = event.data;
            let position = this.dragData.getLocalPosition(this);
            this.pivot.set(position.x, position.y);
            this.position.set(this.dragData.global.x, this.dragData.global.y);
            this.beforeDragPosX = this.position.x;
            this.dragAmount = 0;
            this.updateZOrder();
        }
    }

    private onDragEnd(event: any): void {
        this.off("pointerup", this.onDragEnd);
        this.off("pointerupoutside", this.onDragEnd);
        this.off("pointermove", this.onDragUpdate);
        this.domVideoElement.play();
        if (this.dragAmount !== 0) {
            this.finishDrag();
        } else {
            this.on("pointerdown", this.onDragStart);
            this._onProjectClickedEvent.dispatch(this.currentProjectIndex);
        }
    }

    private onDragUpdate(event: any): void {
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
        this.updateCurrentScreenScale();
        this.updateScreensRenderability();
        this.onAnimationUpdate();
    }

    private updateCurrentScreenScale(): void {
        if ((this.currentProjectIndex > 0 && this.currentProjectIndex < this.lastProjectIndex) || (this.dragDirection === 1 && this.currentProjectIndex === 0) || (this.dragDirection === -1 && this.currentProjectIndex === this.lastProjectIndex)) {
          let newScale: number = (1 - (this.dragAmount / this.screenWidth) * 0.5) * this.videoItemList[this.currentProjectIndex].originalScale.x; 
          this.videoItemList[this.currentProjectIndex].scale.set(newScale);
          this.videoItemList[this.currentProjectIndex].position.x = (this.screenWidth * 0.5 + this.currentProjectIndex * this.screenWidth) + (this.dragAmount * this.dragDirection * 0.7);
          this.videoItemList[this.currentProjectIndex].alpha = 1 - ((this.dragAmount / (this.screenWidth * 0.5)));
        }
    }

    private updateScreensRenderability() : void {
      for (var i = 0; i < this.projectsCount; i++) {
        let renderable: boolean = (i === this.currentProjectIndex || (this.dragAmount * this.dragDirection > 0 && i === this.currentProjectIndex + 1) || (this.dragAmount * this.dragDirection < 0 && i === this.currentProjectIndex - 1));
        this.videoItemList[i].renderable = renderable;
      }
    }

    private finishDrag() {
        this.computeClosestScreen();
    }

    private computeClosestScreen(): void {
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

    private executeTween(slow: boolean = false): void {
        let positionToGoTo: number = -((this.projectIndexToGo) * this.screenWidth) + this.pivot.x;
        this.videoItemList[this.currentProjectIndex].resetOriginalState(this.currentProjectIndex != this.projectIndexToGo);
        this.dragTween = TweenLite.to(this.position, slow ? 1 : 0.5, {
            x: positionToGoTo, ease: Power4.easeOut, onComplete: this.onTweenEnded, onUpdate: () => {
              this.sendSliderPositionUpdate();
            }
        });
        this.previousProjectIndex = this.currentProjectIndex;
        this.currentProjectIndex = this.projectIndexToGo;
    }

    private onTweenEnded = () => {
        this.on("pointerdown", this.onDragStart);
        cancelAnimationFrame(this.animationRequestId);
        this.animationRequestId = undefined;
        this.updateScreensRenderability();
        store.commit('SLIDER_SET_CURRENT_PROJECT_ID', this.currentProjectIndex);
    }

    private updateZOrder(): void {
        this.removeChild(this.videoItemList[this.currentProjectIndex]);
        this.addChildAt(this.videoItemList[this.currentProjectIndex], 0);
    }

    private getVideoTextureRect(projectIndex: number): PIXI.Rectangle {
        let cropTextureWidth: number;
        let cropTextureHeight: number;
        let cropTextureOffset: PIXI.Point = new PIXI.Point();
        if (this.screenRatio > this.mediaRatio) {
          cropTextureWidth = this.screenTextureWidth;
          cropTextureHeight = cropTextureWidth / this.screenRatio;
        } else {
          cropTextureHeight = this.screenTextureHeight;
          cropTextureWidth = cropTextureHeight * this.screenRatio;
        }
        cropTextureOffset.x = (this.screenTextureWidth - cropTextureWidth) * 0.5;
        cropTextureOffset.y = (this.screenTextureHeight - cropTextureHeight) * 0.5;
        
        if (this.videoTextureRatio > 1) { // Mobile video texture
          return new PIXI.Rectangle((projectIndex * this.screenTextureWidth) + cropTextureOffset.x, cropTextureOffset.y, cropTextureWidth, cropTextureHeight);
        } else { // desktop video texture          
          return new PIXI.Rectangle(cropTextureOffset.x, (projectIndex * this.screenTextureHeight) + cropTextureOffset.y, cropTextureWidth, cropTextureHeight);
        }
    }

    private onAnimationUpdate(): void {
      if (!this.animationRequestId) {
        const handler = () => {
          this.sendSliderPositionUpdate();
            //this.shader.size = (this.dragAmount / this.app.screen.width) * -this.dragDirection;
            //console.log(this.shader.size);

            this.animationRequestId = window.requestAnimationFrame(handler);
        };
        this.animationRequestId = requestAnimationFrame(handler);
      }
    }

    private sendSliderPositionUpdate(): void {
      this._onDragUpdateEvent.dispatch(this.position.x - this.pivot.x, (this.dragAmount / this.app.screen.width));
    }

    public goToProjectIndex(index: number): void {
        this.off("pointerdown", this.onDragStart);
        this.projectIndexToGo = index;
        for (var i = 0; i < this.projectsCount; i++) {
          this.videoItemList[i].renderable = (i >= Math.min(this.currentProjectIndex, this.projectIndexToGo)) && (i <= Math.max(this.currentProjectIndex, this.projectIndexToGo));
        }
        this.executeTween(true);
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
}