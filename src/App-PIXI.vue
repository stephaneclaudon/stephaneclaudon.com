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
import Modernizr from "modernizr";
import * as PIXI from "pixi.js";
import PixiSliderVideoContainer from "./components-ts/PixiSliderVideoContainer";

@Component({
  components: {}
})
export default class AppPIXI extends Vue {
  videoElement: HTMLVideoElement;
  pixiApp: PIXI.Application;
  projectsContainer: PixiSliderVideoContainer;

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
    } as PIXI.ApplicationOptions);
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
    this.projectsContainer = new PixiSliderVideoContainer(this.pixiApp, this.projects, this.videoElement);
    this.pixiApp.stage.addChild(this.projectsContainer);
    this.inited = true;
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
