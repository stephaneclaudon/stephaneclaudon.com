<template>
  <div id="projects-slider-canvas" class="projects-slider-canvas" :class="{'inactive': !active}">
    <div id="videosContainer">
      <video id="video" playsinline loop muted autoplay>
        <source :src="getVideoPath()" type="video/mp4">
        Your browser does not support the video tag.
      </video>
    </div>
    <canvas id="pixiElement"></canvas>
    <div id="projects-slider-canvas-titles" class="projects-slider-canvas-titles" ref="sliderTitlesContainer">
      <div class="grid-x align-middle" v-for="(project, index) in projects" :key="project.id">
            <div class="cell small-10 small-offset-1">
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
  titlesContainerElement: Element;
  videoElement: HTMLVideoElement;
  pixiApp: PIXI.Application;
  projectsContainer: PixiSliderVideoContainer;

  currentIndex: number = 0;
  sliderIsMoving: boolean = false;

  @State("projects") projects: Array<any>;
  @Prop() active: boolean;
  
  created() {
    
  }

  mounted() {
    console.log("Init ProjectsSliderCanvas");
    this.initTitles();
    this.initPIXI();
  }

  getVideoPath(): String {
    return "/dist/assets/loops/all-projects-mobile-low.mp4";
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
    this.videoElement = document.getElementById("video") as HTMLVideoElement;
    this.videoElement.addEventListener("playing", this.onVideoStartPlaying, false);
  }

  onVideoStartPlaying(): void {
    this.videoElement.removeEventListener("playing", this.onVideoStartPlaying, false);
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
  
  onSliderTransitionUpdate(posX: number): void {
    (<HTMLElement>this.titlesContainerElement).style.left = posX + "px";
  }

  onSliderTransitionEnd(index: number): void {
    this.sliderIsMoving = false;
    this.currentIndex = index;
  }

  onProjectClicked(projectIndex: number): void {
    if(this.active) {
      this.$router.push({ name: 'project', params: { id: this.projects[projectIndex].id }})
    } else {
      this.$router.push({ name: 'home', params: {}})
    }
    
  }

  isCurrentIndex(index: number): boolean {
    return this.currentIndex === index;
  }

  @Watch('active')
  onSliderStateChanged(val: boolean, oldVal: boolean) {
    if(val) {
      this.pixiApp.ticker.start();
    } else {
      this.pixiApp.ticker.stop();
    }
  }

  initTitles(): void {
    this.titlesContainerElement = <Element>this.$refs.sliderTitlesContainer;
    let allTitles: HTMLCollection = this.titlesContainerElement.children as HTMLCollection;
    let containerWidth: number = 0;
    for (let index = 0; index < allTitles.length; index++) {
      let title: Element = allTitles[index];
      (<HTMLElement>title).style.width = title.clientWidth + "px";
      containerWidth += title.clientWidth;
    }
    (<HTMLElement>this.titlesContainerElement).style.width = containerWidth + "px";
  }
}
</script>

<style lang="scss">
  @import "../style/main.scss";

  #videosContainer {
    visibility: hidden;
    position: fixed;
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
    height: 100%;
    width: 100%;
    position: relative;
    z-index: 0;
    overflow: hidden;
    @include transition(all .5s ease-out);
    &-titles .grid-x, &-titles .grid-x .call, &-titles .projects-slider-item__title h1 {    
      @include transition(all .5s ease-out);
    }

    &.inactive {
      height: 35%;
      .projects-slider-canvas-titles {
        .grid-x {
          .cell {
            margin-top: 0%;
            .projects-slider-item__title h1 {
              width: 100%;
            }
          }
        }
      }
    }

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
      height: 100%;
      width: 100%;

      .grid-x {
        height: 100%;
        width: 100%;
        float: left;
        text-align: left;
        .cell {
          margin-top: 35%;
          .projects-slider-item__title h1 {
            text-align: center;
            display: inline-block;
            width: 22%;
            .title--inner {
              white-space: nowrap
            }
          }
          
        }
      }
    }
  }
</style>
