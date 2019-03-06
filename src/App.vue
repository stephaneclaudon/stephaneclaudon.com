<template>
  <div id="main" class="app grid-container full" :class="cssClasses">

    <div class="project-slider-container" :class="{'inactive': !projectSliderVisible}">
      <projects-slider-canvas v-if="Modernizr.canvas" class="project-slider-canvas" :active="projectSliderVisible && !transitioning"></projects-slider-canvas>
      <projects-slider v-else class="project-slider"></projects-slider>
    </div>

    <transition v-on:before-enter="onTransitionBeforeEnter" v-on:after-enter="onTransitionAfterEnter" v-on:before-leave="onTransitionBeforeLeave" v-on:after-leave="onTransitionAfterLeave" name="trans-project">
      <project-details id="project-details" v-show="showProjectDetails" :visible="projectDetailsVisible" :transform-origin-style="projectDetailsTransformOriginStyle" :transform-style="projectDetailsTransformStyle"></project-details>
    </transition>

    <transition name="trans-name">
      <div v-show="!showProjectDetails" class="name-wrapper small-offset-1">
        <router-link to="/" class="main-name">
          <div class="main-name__first">Stéphane</div>
          <div class="main-name__last">CLAUDON</div>
        </router-link>
      </div>
    </transition>
    
    <showreel-box></showreel-box>
    <contact-box></contact-box>

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
import ShowreelBox from "./components/showreel.vue";
import ContactBox from "./components/contact.vue";
import ProjectsSlider from "./components/projects-slider.vue";
import ProjectsSliderCanvas from "./components/projects-slider-canvas.vue";
import ProjectDetails from "./components/project-details.vue";
import * as MutationTypes from "./store/mutation-types";
import Utils from "./utils/Utils";

import * as ModernizrObject from "modernizr";
import { TweenLite, Power2 } from "gsap";
//@ts-ignore
import "gsap/ScrollToPlugin";
import { currentSliderProjectId } from "./store/getters";

@Component({
  components: {
    ShowreelBox,
    ContactBox,
    ProjectsSlider,
    ProjectsSliderCanvas,
    ProjectDetails
  }
})
export default class App extends Vue {
  @State("projects") projects: Array<any>;
  @State("currentProject") currentProject: any;
  @State("currentSliderProjectId") currentSliderProjectId: any;

  @Mutation(MutationTypes.SET_CURRENT_PROJECT)
  commitCurrentProject: (project: Object) => void;

  private transitioning: boolean = false;
  private showProjectDetails: boolean = false;
  private projectSliderVisible: boolean = false;
  private projectDetailsVisible: boolean = false;

  private scrollAnimationRequestId: number;
  private scrollTop: any;
  private projectDetailsTransformOriginStyle: string = '';
  private projectDetailsTransformStyle: string = '';

  get Modernizr(): any {
    return ModernizrObject;
  }

  created() {
    if (this.$router.currentRoute.path.indexOf("project") > -1) {
      this.setCurrentProject(this.getProjectFromId(this.$router.currentRoute.name!));
      this.showProjectDetails = true;
      this.projectDetailsVisible = true;
      Utils.setBodyClass('project-details');
      this.watchScroll();
    } else {
      this.projectSliderVisible = true;
      this.setCurrentProject(this.projects[0]);
      Utils.setBodyClass(this.$router.currentRoute.name!);
    }

    if (this.$router.currentRoute.path.indexOf("showreel") > -1){
      this.projectSliderVisible = false;
    }
  }

  mounted(): void {
    //@ts-ignore
    window.onAppMounted(); //ugly i know... declaration in preloader.ts
  }

  @Watch("$route")
  onRouteChanged(to: any, from: any): void {
    if (to.path.indexOf("project") > -1) {
      this.setCurrentProject(this.getProjectFromId(to.name!));
      this.showProjectDetails = true;
      Utils.setBodyClass('project');
    } else if (to.name === "home") {
      if (from.path.indexOf("project") > -1) 
        this.projectDetailsTransformStyle = ModernizrObject.prefixedCSS('transform') + ': translateY(' + -this.scrollTop + 'px);';
      
      Utils.setBodyClass('home');
      this.showProjectDetails = false;
      this.projectSliderVisible = true;
    } else if (to.name === "contact") {
      Utils.setBodyClass('contact');
    } else if (to.name === "showreel") {
      this.projectSliderVisible = false;
      Utils.setBodyClass('showreel');
    }
  }

  @Watch("currentSliderProjectId")
  onCurrentSliderProjectIdChanged(projectIndex: any, oldProjectId: any): void {
    this.setCurrentProject(this.getProjectFromIndex(projectIndex));
  }

  onTransitionBeforeEnter(el: HTMLElement) {
    this.projectSliderVisible = false;
    this.transitioning = true;
  }
  onTransitionAfterEnter(el: HTMLElement) {
    this.projectDetailsVisible = true;
    this.transitioning = false;
    Utils.setBodyClass('project-details');
    this.watchScroll();
  }

  onTransitionBeforeLeave(el: HTMLElement) {
    this.unwatchScroll();
    this.projectSliderVisible = true;
    this.transitioning = true;
  }

  onTransitionAfterLeave(el: HTMLElement) {
    this.projectDetailsVisible = false;
    this.transitioning = false;
    this.projectDetailsTransformOriginStyle = '';
    this.projectDetailsTransformStyle = '';

    let currentSliderProject: any = this.getProjectFromIndex(this.currentSliderProjectId);
    this.setCurrentProject(currentSliderProject);    
  }

  setCurrentProject(project: any): void {
    if (this.currentProject.id !== project.id) this.commitCurrentProject(project);
  }

  getProjectFromId(projectId: string): any {
    for (let index = 0; index < this.projects.length; index++) {
      if (this.projects[index].id === projectId) {
        return this.projects[index];
      }
    }
  }

  getProjectFromIndex(projectIindex: number): any {
    return this.projects[projectIindex];
  }

  watchScroll(): void {
    this.scrollTop = (document.documentElement && document.documentElement.scrollTop) || (document.body.scrollTop) || (document.scrollingElement);
    this.scrollTop = isNaN(this.scrollTop) ? 0 : this.scrollTop;
    this.projectDetailsTransformOriginStyle = ModernizrObject.prefixedCSS('transform-origin') + ': center ' + (this.scrollTop + (process.viewportSize.height * 0.5)) + 'px;';
    this.scrollAnimationRequestId = window.requestAnimationFrame(this.watchScroll);
  }

  unwatchScroll = () => {
    cancelAnimationFrame(this.scrollAnimationRequestId);
    this.scrollAnimationRequestId = -1;
  }

  get cssClasses(): Array<string> {
    return [
      this.transitioning ? "app--transitioning" : "",
      this.$router.currentRoute.name!
    ];
  }
}
</script>

<style lang="scss">
@import "./style/main.scss";

$projectTransitionDuration: 300ms;

body {
  &.home {
    position: fixed;
    overflow: hidden;

    #main {
      width: 100vw;
      height: 100vh;

      /* Large and up */
      @media screen and (max-width: 63.99999999em) {
        overflow-y: scroll;
        -webkit-overflow-scrolling: touch;
      }
    }
  }
  &.contact {
    .showreel-wrapper {
      display: none;
    }
  }
  &.showreel {
    .contact-wrapper {
      display: none;
    }
  }
}

.project-slider {
  @include opacity(0);
  @keyframes sliderProject {
    from {
      @include opacity(0);
    }
    to {
      @include opacity(1);
    }
  }
  @include animation(0.5s, 1s, sliderProject);
}

.name-wrapper {
  position: absolute;
  top: 5%;
  @include transform-origin(50vw 50vh);

  /* Large and up */
  @media screen and (min-width: 64em) {
    top: 50px;
    left: 50px;
    margin-left: 0;
  }
}
#main {
  position: relative;
  height: 100%;
  &.app--transitioning
  {
    overflow: hidden;
  }
}

.main {
  &-name {
    display: block;
    @include opacity(0);
    @keyframes mainName {
      from {
        @include opacity(0);
      }
      to {
        @include opacity(1);
      }
    }
    @include animation(0s, 1s, mainName);
    animation-timing-function: ease-out;
    text-transform: uppercase;
    &__first {
      @include roboto-light;
      font-size: 1em;
      letter-spacing: 0.72em;
    }
    &__last {
      @include roboto-black;
      font-size: 1.93em;
      letter-spacing: 0.105em;
    }
  }
}

.project-slider-container {
  position: fixed;
  height: 100%;
  width: 100%;
}

.trans-name-enter-active,
.trans-name-leave-active,
.project-slider-container {
  @include transition(transform $projectTransitionDuration ease-out, opacity $projectTransitionDuration ease-out);
  @include transform(scale(1));
  @include opacity(1);
}
.trans-name-enter,
.trans-name-leave-to,
.project-slider-container.inactive {
  @include opacity(0);
  @include transform(scale(0.8));
}

.trans-project-enter-active,
.trans-project-leave-active {
  pointer-events: none;
  @include transition(transform $projectTransitionDuration ease-out, opacity $projectTransitionDuration ease-out);
  @include transform-origin(center 50vh);
  @include transform(scale(1));
  @include opacity(1);
}
.trans-project-enter,
.trans-project-leave-to {
  @include opacity(0);
  @include transform(scale(1.2));
}
</style>
