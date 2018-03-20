<template>
    <div id="slider" class="swipe">
        <div class="projects swipe-wrap" >
            <div v-for="(project, index) in projects" :key="project.id" class="projects--item">
                <a @click="viewProject(project)" href="#">
                    <div class="projects--item__bg grid-x align-middle align-center">
                        <!--<img :src="getVideoPoster(project)" :alt="project.title">-->
                        <div>
                            <video autoplay loop>
                                <source :src="getVideoPath(project)" type="video/mp4">
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    </div>
                    <div class="projects--item__title grid-x align-middle">
                        <div class="cell small-10 small-offset-1">
                            <h1 v-if="isCurrentIndex(index)">
                                <span class="title--inner" v-for="(titleString, titleIndex) in projectsArrayTitle[index]" :key="titleIndex"><span>{{ titleString }}</span></span>
                            </h1>

                            <div class="title--innerfake"><span :id="project.id" :class="index">{{ project.title }}</span></div>
                        </div>
                    </div>
                </a>
            </div>
        </div>
    </div>
  
</template>

<script lang="ts">
import { State, Mutation } from "vuex-class";
import { Vue, Component, Prop, Emit } from "vue-property-decorator";
import * as MutationTypes from "../store/mutation-types";
//@ts-ignore
import * as SwipeJS from "swipejs";

@Component
export default class ProjectsSlider extends Vue {
  @State("projects") projects: Array<Object>;

  @Mutation(MutationTypes.SET_CURRENT_PROJECT)
  setCurrentProject: (project: Object) => void;

  projectsArrayTitle: Array<Array<string>> = [];
  projectsSwipe: Object = {};
  currentIndex: number = 0;

  viewProject(project: any): void {
    this.setCurrentProject(project);
    console.log("View project " + project.title);
  }

    getVideoPath(project: any): String {
        return '/dist/assets/loops/' + project.id + '.mp4';
    }
  getVideoPoster(project: any): String {
    let posterUrl: String = "";
    switch (project.videoplateform) {
      case "facebook": {
        posterUrl =
          "https://scontent-cdg2-1.xx.fbcdn.net/v/t15.0-10/p720x720/24594542_10155038687253204_6434570426336149504_n.jpg?oh=b451a3b459ddc1bb108b461318452c62&oe=5B3F841D";
        break;
      }
      case "vimeo": {
        posterUrl =
          "https://i.vimeocdn.com/video/" +
          project.videoid +
          ".webp?mw=1300&mh=542";
        break;
      }
      case "youtube": {
        posterUrl =
          "https://i.ytimg.com/vi/" + project.videoid + "/maxresdefault.jpg";
        break;
      }
      default: {
        console.log("Invalid choice");
        break;
      }
    }

    return posterUrl;
  }

  checkTitlesLineBreak() {
    console.log(this.$refs);

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
  }

  mounted() {
    this.checkTitlesLineBreak();

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
        transitionEnd: this.onSliderTransitionEnd
      }
    ) as Object;
  }

  onSliderInited(index: number, elem: HTMLElement, dir: number): void {}
  onSliderTransitionEnd(index: number, elem: HTMLElement): void {
    this.currentIndex = index;
  }

  isCurrentIndex(index: number): boolean {
    return this.currentIndex === index;
  }
}
</script>

<style lang="scss">
@import "../style/main.scss";
$titleAnimationDuration: 0.75s;
$titleAnimationMultilineDelay: 0.15s;

#slider {
  height: 100%;
}
.projects {
  height: 100%;
  &--item {
    height: 100%;
    &__bg {
      height: 100%;
      overflow: hidden;
      img {
        height: 100%;
      }
    }
    &__title {
      position: absolute;
      top: 0;
      padding-top: 35%;
      height: 100%;
      width: 100%;
      text-align: left;
      .title--inner,
      .title--innerfake {
        position: relative;
        display: inline-block;
        z-index: 200;
        padding: 0.5em;
        vertical-align: middle;
        text-transform: uppercase;
        font-size: 2em;
        span {
          @include roboto-black;
          letter-spacing: 0.05em;
        }
      }
      .title--innerfake {
        visibility: hidden;
      }
      .title--inner {
        overflow: hidden;
        span {
          visibility: hidden;
          @keyframes textAnim {
            from {
              visibility: hidden;
            }
            to {
              visibility: visible;
            }
          }
        }
        &::after {
          position: absolute;
          display: block;
          top: -1px;
          right: 100%;
          bottom: -1px;
          left: -1%;
          content: "";
          background: $black;

          @keyframes blackBG {
            0% {
              right: 100%;
            }
            50% {
              right: 0%;
              left: -1%;
            }
            100% {
              right: 0%;
              left: 100%;
            }
          }
          @include animation-timing-function(cubic-bezier(0.55, 0, 0.28, 1));
        }
        &::before {
          position: absolute;
          visibility: hidden;
          z-index: -1;
          top: -1px;
          right: 0%;
          bottom: 0px;
          left: -1%;
          content: "";
          @include horizontal-gradient($blue, $purple);

          @keyframes gradientBG {
            from {
              visibility: hidden;
            }
            to {
              visibility: visible;
            }
          }
          
        }
      }
      .title--inner:not(:last-child)::before {
        border-bottom: solid 1px $black;
      }
      @for $i from 0 through 4 {
        .title--inner:nth-child(#{$i}) {
            span {
                @include animation(#{$i * $titleAnimationMultilineDelay + $titleAnimationDuration * 0.5}, 0.01s, textAnim);
            }
            &::before {
                @include animation(#{$i * $titleAnimationMultilineDelay+$titleAnimationDuration * 0.5}, 0.01s, gradientBG);
            }
            &::after {
                @include animation(#{$i * $titleAnimationMultilineDelay}, $titleAnimationDuration, blackBG);
            }
        }
      }
    }
  }
}
</style>
