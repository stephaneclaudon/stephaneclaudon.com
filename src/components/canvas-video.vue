<template>
    <div :id="wrapperId" class="canvas-video-wrapper">
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
//@ts-ignore
import * as PIXI from "pixi.js";

@Component
export default class CanvasVideo extends Vue {
  loopsPath: string = "dist/assets/loops/";
  wrapperId: string = "canvas-video-wrapper_";
  pixiTicker: any = PIXI.ticker.shared;
  videoTexture: PIXI.Texture

  @Prop() name: string;
  @Prop() title: string;
  @Prop({ default: false })
  alive: boolean;

  created() {
    this.wrapperId = this.wrapperId + this.name;
  }

  toggleVideo () {
    
    console.log(this.name, this.alive + '', this.videoTexture.baseTexture.autoPlay, this.videoTexture.baseTexture.hasLoaded);
        
    if(this.alive) {
        //if(!this.videoTexture.baseTexture.autoPlay && this.videoTexture.baseTexture.hasLoaded)
        
        this.videoTexture.baseTexture.source.play();
        this.pixiTicker.start();
    } else {
        this.videoTexture.baseTexture.source.pause();
        this.pixiTicker.stop();
    }
  }

  mounted () {
    this.pixiTicker.autoStart = this.alive;
    if(!this.pixiTicker.autoStart)
        this.pixiTicker.stop();
    else
        this.pixiTicker.start();

    let wrapperElement: HTMLElement = document.getElementById(
      this.wrapperId
    ) as HTMLElement;

    let app = new PIXI.Application(
      wrapperElement.getBoundingClientRect().width,
      wrapperElement.getBoundingClientRect().height,
      {
        antialias: true,
        transparent: false,
        resolution: 1
      }
    );
    wrapperElement.appendChild(app.view);
    // create a video texture from a path
    this.videoTexture = PIXI.Texture.fromVideo(this.loopsPath + this.name + ".mp4");
    this.videoTexture.baseTexture.source.loop = "loop";
    this.videoTexture.baseTexture.autoPlay = true;

    // create a new Sprite using the video texture (yes it's that easy)
    let videoSprite = new PIXI.Sprite(this.videoTexture);

    let aspectRatio: number = 0.5625;
    videoSprite.height = app.screen.height;
    videoSprite.width = videoSprite.height / aspectRatio;

    // center the sprites anchor point
    videoSprite.anchor.x = 0.5;
    videoSprite.anchor.y = 0.5;

    // move the sprite to the center of the screen
    videoSprite.position.x = window.innerWidth / 2;
    videoSprite.position.y = window.innerHeight / 2;

    app.stage.addChild(videoSprite);
    
  }

  @Watch('alive', { immediate: false, deep: false })
  onAliveChanged(val: boolean, oldVal: boolean) {
    this.toggleVideo ()
  }
}
</script>

<style lang="scss" scoped>
.canvas-video-wrapper {
  height: 100%;
  width: 100%;
}
</style>