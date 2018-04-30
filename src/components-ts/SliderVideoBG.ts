import VideoSnapshooter from "./VideoSnapshooter";
import * as PIXI from "pixi.js";
//@ts-ignore
import * as fShaderCode from "../shaders/postEffect.fs"
//@ts-ignore
import glslify from "glslify"

//PIXI.loader.add(["../dist/assets/shaders/postEffect.fs","../dist/assets/shaders/postEffect.vs"]);

export default class SliderVideoBG {

    videoElement: HTMLVideoElement;
    alive: boolean;
    inited: boolean = false;
    projectTitle:string;
    
    constructor(projectTitle: string, videoElement: HTMLVideoElement, alive: boolean) {
        
        //this.pixiTicker.stop();
        this.projectTitle = projectTitle;
        this.alive = alive;
        this.videoElement = videoElement;
        this.videoElement.addEventListener(
            "playing",
            () => this.onVideoStartPlaying(),
            false
        );
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
        this.videoElement.pause();
    }

    unfreezeVideo(): void {
        this.videoElement.play();
    }
}