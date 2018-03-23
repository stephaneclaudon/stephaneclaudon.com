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
import ProjectsSliderItem from './projects-slider-item.vue';
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
  titlesComputed: boolean = false;
  sliderIsMoving: boolean = false;

  viewProject(project: any): void {
    this.setCurrentProject(project);
    console.log("View project " + project.title);
  }

  checkTitlesLineBreak() {
    this.projects.forEach(project => {
      let currentPorject: any = project;
      let currentHtmlTitle: Element = document.getElementById(
        currentPorject.id
      ) as Element;

      if (currentHtmlTitle !== null) {
        let text: string = currentHtmlTitle.textContent as string;
        let words = text.split(" ");
        currentHtmlTitle.textContent = words[0];
        let height = currentHtmlTitle.getBoundingClientRect().height;
        let currentTitleArray: Array<string> = [];
        let lastFoundWordIndex: number = 0;

        for (let i = 1; i < words.length; i++) {
          currentHtmlTitle.textContent =
            currentHtmlTitle.textContent + " " + words[i];

          if (currentHtmlTitle.getBoundingClientRect().height > height) {
            height = currentHtmlTitle.getBoundingClientRect().height;

            currentTitleArray.push(
              words.slice(lastFoundWordIndex, i).join(" ")
            );
            lastFoundWordIndex = i;
          }
        }
        currentTitleArray.push(
          words.slice(lastFoundWordIndex, words.length).join(" ")
        );
        this.projectsArrayTitle.push(currentTitleArray);
      }
    });
    this.titlesComputed = true;
  }

  mounted() {
    //this.checkTitlesLineBreak();

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
        callback: this.onSliderInited,
        transitionEnd: this.onSliderTransitionEnd,
        transitionStart: this.onSliderTransitionStart
      }
    ) as Object;
  }

  onSliderInited(index: number, elem: HTMLElement, dir: number): void {}
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

#slider {
  height: 100%;
}
.projects {
  height: 100%;
}
</style>
