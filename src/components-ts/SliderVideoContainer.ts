import * as PIXI from "pixi.js";
import { TweenMax } from "gsap";
//@ts-ignore
import * as PixiPlugin from "gsap/PixiPlugin";

export default class SliderVideoContainer extends PIXI.Container {
    dragging: any = false;
    dragData: any;

    app: PIXI.Application;
    projectsCount: number;
    currentProjectIndex: number;
    screenWidth: number;

    constructor(app: PIXI.Application, projects: Array<any>, domVideoElement: HTMLVideoElement) {
        super();
        this.app = app;
        this.projectsCount = projects.length;
        this.screenWidth = this.app.screen.width;
        
        for (var i = 0; i < 5; i++) {
            let startText: PIXI.Texture = PIXI.Texture.fromVideo(domVideoElement);
            (<PIXI.VideoBaseTexture>startText.baseTexture).autoPlay = true;
            (<PIXI.VideoBaseTexture>startText.baseTexture).autoUpdate = true;

            let frame: PIXI.Rectangle = new PIXI.Rectangle(i * 180, 0, 180, 320);
            let projectTexture = new PIXI.Texture(startText.baseTexture, frame);
            startText.destroy();

            let projectSprite = new PIXI.Sprite(projectTexture);
            projectSprite.position.x = window.innerWidth * 0.5 + i * window.innerWidth;
            console.log(projectSprite.position.x);

            projectSprite.anchor.x = 0.5;
            projectSprite.position.y = window.innerHeight * 0.5;
            projectSprite.anchor.y = 0.5;

            projectSprite.width = window.innerWidth;
            projectSprite.height = window.innerHeight;

            this.addChild(projectSprite);
        }
        this.createDragAndDropFor();
    }

    createDragAndDropFor() {
        this.interactive = true;
        this.on("pointerdown", this.onDragStart);
        this.on("pointerup", this.onDragEnd);
        this.on("pointerup", this.onDragEnd);
        this.on("pointermove", this.onDragUpdate);
    }

    onDragStart(event: any): void {
        this.dragging = this;
        this.dragData = event.data;
        let position = this.dragData.getLocalPosition(this);
        this.pivot.set(position.x, position.y);
        this.position.set(this.dragData.global.x, this.dragData.global.y)
    }

    onDragEnd(event: any): void {
        this.dragging = false;
        this.finishDrag();
    }

    onDragUpdate(event: any): void {
        if (this.dragging) {
            let newPos = this.dragData.getLocalPosition(this.parent);
            this.position.x = this.dragData.getLocalPosition(this.parent).x;
        }
    }

    finishDrag() {
        this.computeClosestScreen();
    }

    computeClosestScreen(): void {
        let positionToScreenCenter : number = Math.abs((this.position.x - this.pivot.x));
        
        let numberOfScreensLeftSide: number = Math.abs(Math.floor(positionToScreenCenter / this.screenWidth));
        let spaceBetweenLeftScreenAndCenter: number = (positionToScreenCenter % this.screenWidth) - (this.screenWidth *0.5);
        console.log(numberOfScreensLeftSide, spaceBetweenLeftScreenAndCenter);
        if(spaceBetweenLeftScreenAndCenter > 0) {
            console.log("goto left");
            let positionToGoTo: number = -((numberOfScreensLeftSide + 1) * this.screenWidth) + this.pivot.x;
            TweenMax.to(this.position, 0.1, {x: positionToGoTo});
        }else {
            console.log("goto right");
            let positionToGoTo: number = -((numberOfScreensLeftSide) * this.screenWidth) + this.pivot.x;
            TweenMax.to(this.position, 0.1, {x: positionToGoTo});
        }
        
    }
}