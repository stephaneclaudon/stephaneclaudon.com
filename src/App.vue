<template>
  <div class="app grid-container full">

    <projects-slider-canvas v-if="Modernizr.canvas" class="project-slider-canvas"></projects-slider-canvas>
    <projects-slider v-else class="project-slider"></projects-slider>

    <project-details v-if="this.currentProject.id" :project="this.currentProject"></project-details>

    <div class="name-wrapper">
      <div class="grid-x">
        <div class="cell small-10 small-offset-1">
          <div class="main-name">
            <div class="main-name__first">Stéphane</div>
            <div class="main-name__last">CLAUDON</div>
          </div>
        </div>
      </div>
    </div>
    
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
import { TweenLite, Power4 } from "gsap";
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
  @State("currentProject") currentProject: Object;

  @Mutation(MutationTypes.LOAD_PROJECTS)
  loadProject: (projects: Array<Object>) => void;

  @Mutation(MutationTypes.SET_CURRENT_PROJECT)
  setCurrentProject: (project: Object) => void;

  private needScrollDown: boolean = false;

  get Modernizr(): any {
    return ModernizrObject;
  }

  created() {
    this.loadProject(jsonData);
    if (this.$router.currentRoute.name === "project") {
      this.gotoProject(this.$router.currentRoute.params.id);
    }
  }

  @Watch("$route")
  onRouteChanged(to: any, from: any): void {
    if (to.name === "project") {
      this.gotoProject(to.params.id);
    } else {
      this.needScrollDown = false;
    }
  }

  @Watch("currentProject")
  onProjectChanged(to: any, from: any): void {
    console.log("project changed!!!!");
    
    this.checkScrollDown();
  }

  gotoProject(projectId: string): void {
    this.needScrollDown = true;
    this.setCurrentProject(this.getProjectFromId(projectId));
  }

  mounted(): void {
    //this.checkScrollDown();
  }

  updated(): void {
    this.checkScrollDown();
  }

  checkScrollDown(): void {
    console.log("scrollto ?????", document.body.scrollHeight, window.innerHeight, this.needScrollDown);
    this.$nextTick(() => {
        if(this.needScrollDown) {
          TweenLite.to(window, 1, {
              scrollTo: window.innerHeight * 0.5, ease: Power4.easeOut
            });
        }
      });
    
  }

  getProjectFromId(projectId: string): any {
    for (let index = 0; index < this.projects.length; index++) {
      if (this.projects[index].id === projectId) {
        return this.projects[index];
      }
    }
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
  width: 100%;
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
</style>
