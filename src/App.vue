<template>
  <div id="main" class="app grid-container full" :class="cssClasses">

    <div class="project-slider-container" :class="{'inactive': !projectSliderVisible}">
      <projects-slider-canvas v-if="Modernizr.canvas" class="project-slider-canvas" :active="projectSliderVisible"></projects-slider-canvas>
      <projects-slider v-else class="project-slider"></projects-slider>
    </div>

    <transition v-on:before-enter="onTransitionBeforeEnter" v-on:after-enter="onTransitionAfterEnter" v-on:before-leave="onTransitionBeforeLeave" v-on:after-leave="onTransitionAfterLeave" name="trans-project">
      <project-details v-if="showProjectDetails" :visible="projectDetailsVisible" :transitioning="transitioning"></project-details>
    </transition>

    <transition name="trans-name">
      <div v-show="!showProjectDetails" class="name-wrapper small-offset-1">
        <div class="main-name">
          <div class="main-name__first">Stéphane</div>
          <div class="main-name__last">CLAUDON</div>
        </div>
      </div>
    </transition>
    
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
import ContactBox from "./components/contact.vue";
import ProjectsSlider from "./components/projects-slider.vue";
import ProjectsSliderCanvas from "./components/projects-slider-canvas.vue";
import ProjectDetails from "./components/project-details.vue";
import jsonData from "./assets/data/data.json";
import * as MutationTypes from "./store/mutation-types";

import * as ModernizrObject from "modernizr";
import { TweenLite, Power2 } from "gsap";
//@ts-ignore
import "gsap/ScrollToPlugin";

@Component({
  components: {
    ContactBox,
    ProjectsSlider,
    ProjectsSliderCanvas,
    ProjectDetails
  }
})
export default class App extends Vue {
  @State("projects") projects: Array<any>;
  @State("currentProject") currentProject: any;

  @Mutation(MutationTypes.SET_CURRENT_PROJECT)
  setCurrentProject: (project: Object) => void;

  private sliderActive: boolean = true;
  private transitioning: boolean = false;
  private showProjectDetails: boolean = false;
  private projectSliderVisible: boolean = false;
  private projectDetailsVisible: boolean = false;

  get Modernizr(): any {
    return ModernizrObject;
  }

  created() {
    if (this.$router.currentRoute.path.indexOf("project") > -1) {
      this.gotoProject(this.$router.currentRoute.name!);
      this.projectDetailsVisible = true;
    } else {
      this.projectSliderVisible = true;
    }
  }

  mounted(): void {
    //@ts-ignore
    window.onAppMounted(); //ugly i know... declaration in preloader.ts
  }

  @Watch("$route")
  onRouteChanged(to: any, from: any): void {
    if (to.path.indexOf("project") > -1) {
      this.gotoProject(to.name);
    } else if (to.name != "contact") {
      this.showProjectDetails = false;
    }
  }

  @Watch("currentProject")
  onProjectChanged(val: any, old: any): void {
    this.sliderActive = this.currentProject.id === undefined;
  }

  gotoProject(projectId: string): void {
    this.showProjectDetails = true;
    this.setCurrentProject(this.getProjectFromId(projectId));
  }

  onTransitionBeforeEnter(el: HTMLElement) {
    this.projectSliderVisible = false;
    this.transitioning = true;
  }
  onTransitionAfterEnter(el: HTMLElement) {
    this.projectDetailsVisible = true;
    this.transitioning = false;
  }

  onTransitionBeforeLeave(el: HTMLElement) {
    this.projectSliderVisible = true;
    this.transitioning = true;
  }

  onTransitionAfterLeave(el: HTMLElement) {
    this.projectDetailsVisible = false;
    this.transitioning = false;
    this.setCurrentProject({});
  }

  getProjectFromId(projectId: string): any {
    for (let index = 0; index < this.projects.length; index++) {
      if (this.projects[index].id === projectId) {
        return this.projects[index];
      }
    }
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

  /* Large and up */
  @media screen and (min-width: 64em) {
    top: 50px;
    left: 50px;
    margin-left: 0;
  }
}
#main {
  position: relative;
  overflow-x: hidden;
  height: auto;
  &.app--transitioning,
  &.home {
    overflow: hidden;
    height: 100%;
    width: 100%;
    position: relative;
  }
}

.main {
  &-name {
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
  position: absolute;
  height: 100%;
  width: 100%;
}

.trans-name-enter-active,
.trans-name-leave-active,
.project-slider-container {
  @include transition(all 0.3s ease-out);
  @include transform(scale(1));
  @include opacity(1);

  /*.projects-slider-canvas-titles .grid-x .cell {
    @include transition(all 0.3s ease-out);
  }*/
}
.trans-name-enter,
.trans-name-leave-to,
.project-slider-container.inactive {
  @include opacity(0);
  @include transform(scale(0.8));

  /*.projects-slider-canvas-titles .grid-x .cell {
    margin-top: -110%;
    margin-left: 25%;
  }*/
}

.trans-project-enter-active,
.trans-project-leave-active {
  pointer-events: none;
  @include transition(transform 0.3s ease-out, opacity 0.3s ease-out);
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
