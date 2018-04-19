import * as PIXI from "pixi.js";

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

            projectSprite.width = window.innerWidth - 10;
            projectSprite.height = window.innerHeight - 10;

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
            this.computeClosestScreen();
        }
    }

    finishDrag() {
        this.computeClosestScreen();
    }

    computeClosestScreen(): void {
        let positionToScreenCenter : number = this.position.x + (this.screenWidth * 0.5 );
        let numberOfScreensLeftSide: number = positionToScreenCenter % this.screenWidth;
        console.log(positionToScreenCenter- (numberOfScreensLeftSide * this.screenWidth));
        
        //this.currentProjectIndex = 
    }
}