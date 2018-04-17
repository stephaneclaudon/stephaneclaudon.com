<template>
  <div class="app grid-container full">
    <div id="videosContainer">
      <video id="video" playsinline loop muted autoplay>
        <source :src="getVideoPath()" type="video/mp4">
        Your browser does not support the video tag.
      </video>
    </div>
    <canvas id="pixiElement"></canvas>
  </div>
</template>

<script lang="ts">
import { State, Mutation } from "vuex-class";
import {
  Vue,
  Component,
  Prop,
  Provide,
  Inject,
  Model,
  Watch
} from "vue-property-decorator";
import jsonData from "./assets/data/data.json";
import * as MutationTypes from "./store/mutation-types";
//@ts-ignore
import * as PIXI from "pixi.js";
import { TweenMax } from "gsap";
//@ts-ignore
import * as PixiPlugin from "gsap/PixiPlugin";

@Component({
  components: {}
})
export default class AppPIXI extends Vue {
  videoElement: HTMLVideoElement;
  pixiApp: PIXI.Application;
  projectsContainer: PIXI.Container;
  drag: any = false;

  inited: boolean = false;

  @State("projects") projects: Array<any>;
  @Mutation(MutationTypes.LOAD_PROJECTS)
  loadProject: (projects: Array<any>) => void;

  created() {
    this.loadProject(jsonData);
  }

  mounted() {
    this.initPIXI();
  }

  @Watch("projects", { immediate: false, deep: false })
  onProjectsChanged(val: boolean, oldVal: boolean) {
    console.log(this.projects);
  }

  getVideoPath(): String {
    return "/dist/assets/loops/all-projects-mobile-low.mp4";
  }

  initPIXI() {
    this.pixiApp = new PIXI.Application(window.innerWidth, window.innerHeight, {
      backgroundColor: 0x1099ff,
      antialias: false,
      transparent: false,
      resolution: 1,
      view: document.getElementById("pixiElement")
    });
    this.videoElement = document.getElementById("video") as HTMLVideoElement;
    this.videoElement.addEventListener(
      "playing",
      () => this.onVideoStartPlaying(),
      false
    );
  }

  onVideoStartPlaying(): void {
    if (!this.inited) this.initProjects();
  }

  initProjects() {
    this.projectsContainer = new PIXI.Container();
    this.pixiApp.stage.addChild(this.projectsContainer);
    for (var i = 0; i < 5; i++) {
      let startText: PIXI.Texture = PIXI.Texture.fromVideo(this.videoElement);

      startText.autoPlay = true;
      startText.autoUpdate = true;
      let frame: PIXI.Rectangle = new PIXI.Rectangle(i * 180, 0, 180, 320);
      let projectTexture = new PIXI.Texture(startText, frame);
      startText.destroy();
      startText = null;

      let projectSprite = new PIXI.Sprite(projectTexture);
      projectSprite.position.x = window.innerWidth * 0.5 + i * window.innerWidth;
      console.log(projectSprite.position.x);

      projectSprite.anchor.x = 0.5;
      projectSprite.position.y = window.innerHeight * 0.5;
      projectSprite.anchor.y = 0.5;

      projectSprite.width = window.innerWidth - 10;
      projectSprite.height = window.innerHeight - 10;

      this.projectsContainer.addChild(projectSprite);
    }
    this.createDragAndDropFor(this.projectsContainer);
    this.inited = true;
  }

  createDragAndDropFor(target: PIXI.Container) {
    target.interactive = true;
    target.on("pointerdown", (e: any) => {
      this.drag = target;
      target.data = e.data;

      let position = target.data.getLocalPosition(target);
      target.pivot.set(position.x, position.y);
      target.position.set(target.data.global.x, target.data.global.y)
    });
    target.on("pointerup", (e: any) => {
      this.drag = false;
    });
    target.on("pointerupoutside", (e: any) => {
      this.drag = false;
    });
    target.on("pointermove", (e: any) => {
      if (this.drag) {
        let newPos = target.data.getLocalPosition(target.parent);
        //target.x = newPos.x;
        console.log(target.data.originalEvent);
        
        target.position.x = target.data.getLocalPosition(target.parent).x;
      }
    });
  }
}
</script>

<style lang="scss">
@import "./style/main.scss";
#videosContainer {
  visibility: hidden;
  position: relative;
  video {
    position: absolute;
    width: 100%;
  }
}
#pixiElement {
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
}
</style>
