<template>
  <div id="projects-slider-canvas" class="projects-slider-canvas">
    <div id="videosContainer">
      <video id="video" playsinline loop muted autoplay preload="none">
        <source :src="getVideoPath()" :type="getVideoType()">
        Your browser does not support the video tag.
      </video>
    </div>
    <canvas id="pixiElement"></canvas>
    <div id="projects-slider-canvas-titles" class="projects-slider-canvas-titles" ref="sliderTitlesContainer">
      <div class="grid-x align-center-middle" v-for="(project, index) in projects" :key="project.id">
            <div class="cell small-10 large-8">
              <projects-slider-item-title :project="project" :project-index="index" :alive="isCurrentIndex(index)" :moving="sliderIsMoving" :link="true"></projects-slider-item-title>
            </div>
        </div>
    </div>
    <pagination class="pagination" :page-count="projects.length" :current-index="currentIndex"></pagination> 
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
import * as ModernizrObject from "modernizr";
import * as PIXI from "pixi.js";
import PixiSliderVideoContainer from "../components-ts/PixiSliderVideoContainer";
import ProjectsSliderItemTitle from "./projects-slider-item-title.vue";
import Pagination from "./pagination.vue";

@Component({
  components: {
    ProjectsSliderItemTitle,
    Pagination
  }
})
export default class ProjectsSliderCanvas extends Vue {
  titlesContainerElement: Element;
  videoElement: HTMLVideoElement;
  pixiApp: PIXI.Application;
  projectsContainer: PixiSliderVideoContainer;

  currentIndex: number = 0;
  sliderIsMoving: boolean = false;

  @State("projects") projects: Array<any>;
  @State("sliderCurrentProjectId") currentSliderIndex: number;
  @Prop() active: boolean;
  
  created() {
    
  }

  mounted() {
    console.log("Init ProjectsSliderCanvas");
    // this.updateTitlesSize();
    this.titlesContainerElement = <Element>this.$refs.sliderTitlesContainer;
    this.initPIXI();
  }

  getVideoPath(): String {
    let videoFileName: string = "loops/all-projects-";    
    videoFileName += (process.viewportSize.width > 1024) ? "desktop-3600" : "mobile-640";
    videoFileName += (ModernizrObject.video.webm) ? ".webm" : ".mp4";
    return process.mediaPath + videoFileName;
  }

  getVideoType(): String {
    return (ModernizrObject.video.webm) ? "video/webm" : "video/mp4";
  }

  initPIXI() {
    this.pixiApp = new PIXI.Application(window.innerWidth, window.innerHeight, {
      backgroundColor: 0x0f0f0f,
      antialias: false,
      transparent: false,
      resolution: 1,
      view: document.getElementById("pixiElement")
    } as PIXI.ApplicationOptions);
    //@ts-ignore
    this.pixiApp.renderer.view.style["touch-action"] = "auto";
    this.pixiApp.renderer.plugins.interaction.autoPreventDefault = false;
    this.pixiApp.renderer.autoResize = true;
    this.videoElement = document.getElementById("video") as HTMLVideoElement;
    this.videoElement.addEventListener("loadeddata", this.onVideoLoaded, false);
    this.videoElement.load();
    
    window.addEventListener('resize', this.onResize);
  }

  onResize(e: Event) : void {
    this.pixiApp.renderer.resize(process.viewportSize.width, process.viewportSize.height);
    this.projectsContainer.resizeTextures();
    // this.updateTitlesSize();
  }

  onVideoLoaded(): void {
    this.videoElement.removeEventListener("loadeddata", this.onVideoLoaded, false);
    this.toggleSliderUpdate(this.active);
    this.initProjects();
  }

  initProjects() {
    let bg = new PIXI.Sprite();
    bg.width = window.innerWidth;
    bg.height = window.innerHeight;
    this.pixiApp.stage.addChild(bg);
    this.projectsContainer = new PixiSliderVideoContainer(this.pixiApp, this.projects, this.videoElement);
    this.projectsContainer.onDragStartEvent.subscribe(this.onSliderTransitionStart);
    this.projectsContainer.onDragEndEvent.subscribe(this.onSliderTransitionEnd);
    this.projectsContainer.onDragUpdateEvent.subscribe(this.onSliderTransitionUpdate);
    this.projectsContainer.onProjectClickedEvent.subscribe(this.onProjectClicked);
    this.pixiApp.stage.addChild(this.projectsContainer);
  }

  onSliderTransitionStart(): void {
    this.sliderIsMoving = true;
  }
  
  onSliderTransitionUpdate(posX: number, percent: number): void {
    // (<HTMLElement>this.titlesContainerElement).style.left = posX + "px";
    (<HTMLElement>this.titlesContainerElement).style.setProperty(ModernizrObject.prefixedCSS("transform"), "translateX(" + posX + "px)");
    (<HTMLElement>this.titlesContainerElement).style.setProperty(ModernizrObject.prefixedCSS("filter"), "brightness(" + (1 - percent * 2) + ")");
  }

  onSliderTransitionEnd(index: number): void {
    this.sliderIsMoving = false;
    this.currentIndex = index;
  }

  onProjectClicked(projectIndex: number): void {
    this.$router.push('/project/' + this.projects[projectIndex].id);
  }

  isCurrentIndex(index: number): boolean {
    return this.currentIndex === index;
  }

  @Watch('active')
  onSliderStateChanged(val: boolean, oldVal: boolean) {
    this.toggleSliderUpdate(val);
  }

  toggleSliderUpdate(active: boolean): void {
    if(active) {
      this.pixiApp.ticker.start();
      this.videoElement.play();
    } else {
      this.pixiApp.ticker.stop();
      this.videoElement.pause();
    }
  }

  @Watch('currentSliderIndex')
  onSliderIndexChanged(index: number, oldIndex: number) {
    this.projectsContainer.goToProjectIndex(index);
    this.currentIndex = index;
  }

  updateTitlesSize(): void {
    let allTitles: HTMLCollection = this.titlesContainerElement.children as HTMLCollection;
    let containerWidth: number = 0;
    for (let index = 0; index < allTitles.length; index++) {
      let title: Element = allTitles[index];
      (<HTMLElement>title).style.width = title.clientWidth + "px";
      containerWidth += title.clientWidth;
    }
    (<HTMLElement>this.titlesContainerElement).style.width = containerWidth + "px";
  }

  beforeDestroy(): void {
    this.videoElement.removeEventListener('loadeddata', this.onVideoLoaded);
  }
}
</script>

<style lang="scss" scoped>
@import "../style/mixins.scss";

  #videosContainer {
    position: fixed;
    @include opacity(0);
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

    /*&::after {
      pointer-events: none;
      content: "";
      position: absolute;
      top: -1px;
      left: -1px;
      right: -1px;
      bottom: -1px;
      background-image: radial-gradient(transparent, rgba(0,0,0,0.5)), url("data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M5 0h1L0 6V5zM6 5v1H5z'/%3E%3C/g%3E%3C/svg%3E");
    }*/

    &-titles {
      pointer-events: none;
      position: absolute;
      height: 75%;
      width: 500vw;

      .grid-x {
        height: 100%;
        width: 100vw;
        float: left;
        text-align: left;
        justify-content: center;
        align-content: flex-end;
        align-items: flex-end;
      }

      /* Large and up */
      @media screen and (min-width: 64em) {
        height: 100%;

        .grid-x {
          align-content: center;
          align-items: center;
        }
      }
    }
  }

  .pagination {
    position: absolute;
    bottom: 5%;
    left: 50%;
    @include transform(translateX(-50%));
    height: 18px;
  }
</style>
