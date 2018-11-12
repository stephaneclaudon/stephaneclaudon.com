import * as PIXI from "pixi.js";
import { TweenLite, Power4 } from "gsap";
//@ts-ignore
import "gsap/PixiPlugin";

export default class PixiSliderVideoItem extends PIXI.Sprite {
    private projectIndex: number;
    private originalPosition: PIXI.Point = new PIXI.Point();
    public originalScale: PIXI.Point = new PIXI.Point();

    constructor(projectIndex:number, videoTexture: PIXI.Texture, screenWidth: number, screenHeight: number) {
      super(videoTexture);
      this.projectIndex = projectIndex;
      this.updateInitialPosition(screenWidth, screenHeight);
    }

    public updateInitialPosition(screenWidth: number, screenHeight: number): void {
      this.position.x = screenWidth * 0.5 + this.projectIndex * screenWidth;
      this.anchor.x = 0.5;
      this.position.y = screenHeight * 0.5;
      this.anchor.y = 0.5;
      this.width = screenWidth;
      this.height = screenHeight;
      this.originalPosition.copy(this.position);
      this.originalScale.copy(this.scale);
    }

    public resetOriginalState(indexChanged: boolean): void {
        if(indexChanged) {
            TweenLite.to(this, 0.5, {
                pixi: {
                    alpha: 0
                },
                ease: Power4.easeOut,
                onComplete: () => {
                    this.position = this.originalPosition,
                    this.alpha = 1;
                    this.scale = this.originalScale
                }
            });
        } else {
            TweenLite.to(this, 0.5, {
                pixi: {
                    positionX: this.originalPosition.x,
                    scaleX: this.originalScale.x,
                    scaleY: this.originalScale.y,
                    alpha: 1
                },
                ease: Power4.easeOut
            });
        }
    }

}