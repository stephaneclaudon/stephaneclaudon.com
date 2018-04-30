<template>
  <div id="projects-slider-canvas" class="projects-slider-canvas">
    <div id="videosContainer">
      <video id="video" playsinline loop muted autoplay>
        <source :src="getVideoPath()" type="video/mp4">
        Your browser does not support the video tag.
      </video>
    </div>
    <canvas id="pixiElement"></canvas>
    <div class="projects-slider-canvas-titles">
      <div class="grid-x align-middle" v-for="(project, index) in projects" :key="project.id" >
            <div class="cell small-9 small-offset-1">
              <projects-slider-item-title :project="project" :project-index="index" :alive="isCurrentIndex(index)" :moving="sliderIsMoving"></projects-slider-item-title>
            </div>
        </div>
    </div>
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
import * as MutationTypes from "../store/mutation-types";
import * as PIXI from "pixi.js";
import PixiSliderVideoContainer from "../components-ts/PixiSliderVideoContainer";
import ProjectsSliderItemTitle from "./projects-slider-item-title.vue";

@Component({
  components: {
    ProjectsSliderItemTitle
  }
})
export default class ProjectsSliderCanvas extends Vue {
  videoElement: HTMLVideoElement;
  pixiApp: PIXI.Application;
  projectsContainer: PixiSliderVideoContainer;

  inited: boolean = false;
  currentIndex: number = 0;
  sliderIsMoving: boolean = false;

  @State("projects") projects: Array<any>;

  created() {
  }

  mounted() {
    console.log("Init ProjectsSliderCanvas");
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
    this.projectsContainer.onDragStartEvent.subscribe(() => console.log("On dragstarttttt"));
    this.projectsContainer.onDragEndEvent.subscribe(() => console.log("On onDragEndEvent!!!!!"));
    this.projectsContainer.onDragUpdateEvent.subscribe((container: PixiSliderVideoContainer, posX: number) => console.log("On dragupdattte", posX));
    this.pixiApp.stage.addChild(this.projectsContainer);
    this.inited = true;
  }

  onSliderTransitionStart(): void {
    this.sliderIsMoving = true;
  }
  onSliderTransitionEnd(index: number, elem: HTMLElement): void {
    this.sliderIsMoving = false;
    this.currentIndex = index;
  }

  isCurrentIndex(index: number): boolean {
    return this.currentIndex === index;
  }
}
</script>

<style lang="scss">
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

  .projects-slider-canvas {
    &-titles {
      pointer-events: none;
      position: absolute;
      height: 100%;

      .grid-x {
        position: absolute;
        top: 0;
        height: 100%;
        width: 100%;
        text-align: left;
        .cell {
          margin-top: 35%;
        }
      }
    }
  }
</style>
