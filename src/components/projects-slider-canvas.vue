<template>
  <div id="projects-slider-canvas" class="projects-slider-canvas">
    <div id="videosContainer">
      <video id="video" playsinline loop muted autoplay>
        <source :src="getVideoPath()" type="video/mp4">
        Your browser does not support the video tag.
      </video>
    </div>
    <canvas id="pixiElement"></canvas>
    <div id="projects-slider-canvas-titles" class="projects-slider-canvas-titles" ref="sliderTitlesContainer">
      <div class="grid-x align-middle" v-for="(project, index) in projects" :key="project.id">
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
    this.initTitles();
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
    this.projectsContainer.onDragStartEvent.subscribe(this.onSliderTransitionStart);
    this.projectsContainer.onDragEndEvent.subscribe(this.onSliderTransitionEnd);
    this.projectsContainer.onDragUpdateEvent.subscribe(this.onSliderTransitionUpdate);
    this.pixiApp.stage.addChild(this.projectsContainer);
    this.inited = true;
  }

  onSliderTransitionStart(): void {
    this.sliderIsMoving = true;
  }
  
  onSliderTransitionUpdate(posX: number): void {
    (<HTMLElement>this.$refs.sliderTitlesContainer).style.left = posX + "px";
  }

  onSliderTransitionEnd(index: number): void {
    this.sliderIsMoving = false;
    this.currentIndex = index;
  }

  isCurrentIndex(index: number): boolean {
    return this.currentIndex === index;
  }

  initTitles(): void {
    let titlesContainer: Element = <Element>this.$refs.sliderTitlesContainer;
    let allTitles: HTMLCollection = titlesContainer.children as HTMLCollection;
    let containerWidth: number = 0;
    for (let index = 0; index < allTitles.length; index++) {
      let title: Element = allTitles[index];
      (<HTMLElement>title).style.width = title.clientWidth + "px";
      containerWidth += title.clientWidth;
    }
    (<HTMLElement>titlesContainer).style.width = containerWidth + "px";
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
    overflow: hidden;
    height: 100%;
    width: 100%;
    position: relative;
    z-index: 0;

    &-titles {
      pointer-events: none;
      position: absolute;
      height: 100%;
      width: 100%;

      .grid-x {
        height: 100%;
        width: 100%;
        float: left;
        text-align: left;
        .cell {
          margin-top: 35%;
        }
      }
    }
  }
</style>
