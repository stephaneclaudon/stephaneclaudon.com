<template>
    <div id="slider" class="swipe">
        <div class="projects swipe-wrap" >
            <div v-for="(project, index) in projects" :key="project.id" class="projects--item">
                <a @click="viewProject(project)" href="#">
                    <projects-slider-item :project="project" :project-index="index" :alive="isCurrentIndex(index)" :moving="sliderIsMoving"></projects-slider-item>
                </a>
            </div>
        </div>
    </div>
  
</template>

<script lang="ts">
import { State, Mutation } from "vuex-class";
import { Vue, Component, Prop, Emit } from "vue-property-decorator";
import * as MutationTypes from "../store/mutation-types";
import ProjectsSliderItem from "./projects-slider-item.vue";
//@ts-ignore
import * as SwipeJS from "../lib/swipeJs/swipe.js";

@Component({
  components: {
    ProjectsSliderItem
  }
})
export default class ProjectsSlider extends Vue {
  @State("projects") projects: Array<Object>;

  @Mutation(MutationTypes.SET_CURRENT_PROJECT)
  setCurrentProject: (project: Object) => void;

  projectsArrayTitle: Array<Array<string>> = [];
  projectsSwipe: Object = {};
  currentIndex: number = 0;
  sliderIsMoving: boolean = false;

  mounted() {
    console.log("Init ProjectsSlider");
    this.projectsSwipe = SwipeJS(
      document.getElementById("slider") as HTMLElement,
      {
        startSlide: 0,
        auto: 0,
        draggable: true,
        autoRestart: false,
        continuous: true,
        disableScroll: false,
        stopPropagation: true,
        transitionEnd: this.onSliderTransitionEnd,
        transitionStart: this.onSliderTransitionStart
      }
    ) as Object;
  }

  viewProject(project: any): void {
    this.setCurrentProject(project);
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

<style lang="scss" scoped>
#slider {
  height: 100%;
}
.projects {
  height: 100%;
  &--item {
    height: 100%;
    a {
      display: block;
      height: 100%;
    }
  }
}
</style>
