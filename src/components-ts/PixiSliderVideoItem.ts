import { SignalDispatcher, SimpleEventDispatcher } from "strongly-typed-events";
import * as PIXI from "pixi.js";
import { TweenLite, Power4 } from "gsap";

export default class PixiSliderVideoItem extends PIXI.Sprite {
    private projectIndex: number;

    constructor(projectIndex:number, videoTexture: PIXI.Texture, screenWidth: number, screenHeight: number, screenRatio: number, screenTextureWidth: number, screenTextureHeight: number, mediaRatio: number) {
        super(videoTexture);
        this.projectIndex = projectIndex;
        this.position.x = screenWidth * 0.5 + projectIndex * screenWidth;
        this.anchor.x = 0.5;
        this.position.y = screenHeight * 0.5;
        this.anchor.y = 0.5;
        this.width = screenWidth;
        this.height = screenHeight;
    }

}