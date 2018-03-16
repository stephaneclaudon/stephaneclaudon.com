<template>
    <div id="slider" class="swipe">
        <div class="projects swipe-wrap" >
            <div v-for="project in projects" :key="project.id" class="projects--item">
                <a @click="viewProject(project)" href="#">
                    <div class="projects--item__bg">
                        <img :src="getVideoPoster(project)" :alt="project.title">
                    </div>
                    <div class="projects--item__title grid-x align-middle">
                        <div class="cell small-10 small-offset-1">
                            <h1>
                                <span>{{ project.title }}</span>
                            </h1>
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

  projectsSwipe: Object = {};

  viewProject(project: any): void {
    this.setCurrentProject(project);
    console.log("View project " + project.title);
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

  mounted() {
    this.projectsSwipe = SwipeJS(
      document.getElementById("slider") as HTMLElement,
      {
        startSlide: 0,
        auto: 0,
        draggable: true,
        autoRestart: false,
        continuous: true,
        disableScroll: false,
        stopPropagation: true
      }
    ) as Object;
  }

  onSliderTransitionEnd(index: Object, elem: Object): void {}
}
</script>

<style lang="scss">
@import "../style/main.scss";
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
        height: 100%;
        width: 100%;
        text-align: center;
        h1 {
            position: relative;
            display: inline-block;
            z-index: 200;
            padding: .5em;
            vertical-align: middle;
            text-transform: uppercase;
            font-size: 2em;
            span {
                &::before {
                    position: absolute;
                    display: block;
                    top: -1px;
                    right: 100%;
                    bottom: -1px;
                    left: -1%;
                    content: '';
                    background: $white;
                    @include transition(all .75s cubic-bezier(.55,0,.28,1) .5s);

                    @keyframes blackBG {
                        from {right: 100%;}
                        to {right: 0%;}
                    }
                    animation: blackBG 1s;
                    animation-delay: 2s;
                }
                &::after {
                    /*position: absolute;
                    display: block;
                    top: -1px;
                    right: 100%;
                    bottom: -1px;
                    left: -1%;
                    content: '';
                    @include horizontal-gradient($blue, $purple);
                    @include transition(all .75s cubic-bezier(.55,0,.28,1) .5s);

                    @keyframes gradientBG {
                        from {right: 100%;}
                        to {right: -1%;}
                    }
                    animation: gradientBG 5s infinite;
                    animation-delay: 1s;
                    animation-timing-function: ease-out;*/
                }
            }
            
        }
    }
  }
}
</style>
