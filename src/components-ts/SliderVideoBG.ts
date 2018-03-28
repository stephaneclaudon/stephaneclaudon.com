import VideoSnapshooter from "./VideoSnapshooter";
//@ts-ignore
import * as PIXI from "pixi.js";
//@ts-ignore
import * as fShaderCode from "../shaders/postEffect.fs"
//@ts-ignore
import glslify from "glslify"

//PIXI.loader.add(["../dist/assets/shaders/postEffect.fs","../dist/assets/shaders/postEffect.vs"]);

export default class SliderVideoBG {
    pixiTicker: any = PIXI.ticker.shared;
    pixiApp: PIXI.Application;
    pixiRenderer: PIXI.CanvasRenderer;
    snapshotTexture: PIXI.Texture;
    snapshot: PIXI.Sprite;

    videoElement: HTMLVideoElement;
    alive: boolean;
    inited: boolean = false;
    snapshotURLData: string;
    snapshotShader: PIXI.Filter;
  
    onFreezedCallback: Function;
    projectTitle:string;
    
    constructor(projectTitle: string, canvasElement: HTMLCanvasElement, videoElement: HTMLVideoElement, alive: boolean, onFreezedCallback: Function) {
        
        //this.pixiTicker.stop();
        this.projectTitle = projectTitle;
        this.onFreezedCallback = onFreezedCallback;
        this.alive = alive;
        this.videoElement = videoElement;
        this.videoElement.addEventListener(
            "playing",
            () => this.onVideoStartPlaying(),
            false
        );
        this.pixiApp = new PIXI.Application({ 
            antialias: true,
            transparent: false,
            resolution: 1,
            view: canvasElement
        });
        this.pixiApp.renderer.autoResize = true;
        this.pixiApp.renderer.resize(window.innerWidth, window.innerHeight);
        //this.videoElement.parentElement!.appendChild(this.pixiApp.view);
        
        this.snapshotTexture = PIXI.Texture.fromVideo(this.videoElement);
        this.snapshotTexture.autoPlay = false;
        this.snapshotTexture.autoUpdate = false;
        this.snapshot = new PIXI.Sprite(this.snapshotTexture);
        this.snapshot.position.x = window.innerWidth*0.5;
        this.snapshot.anchor.x = 0.5;
        this.snapshot.position.y = window.innerHeight*0.5;
        this.snapshot.anchor.y = 0.5;
        this.snapshotShader = new PIXI.Filter('', fShaderCode);
        //this.snapshot.filters = [this.snapshotShader];
        this.snapshot.filters = [new PIXI.filters.NoiseFilter()];
        this.pixiApp.stage.addChild(this.snapshot);
    }

    onVideoStartPlaying(): void {
        if (!this.inited) {
            if (!this.alive) {
                this.freezeVideo();
            }
            this.inited = true;
        }
    }

    freezeVideo(): void {
        this.snapshotTexture.baseTexture.source.pause();
        //this.pixiTicker.start();
        this.onFreezedCallback();
    }

    unfreezeVideo(): void {
        this.videoElement.play();
        
        //this.pixiTicker.stop();
    }
}