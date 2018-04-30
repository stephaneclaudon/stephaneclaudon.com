<template>
    <div :id="wrapperId" class="html-video-wrapper projects-slider-item">
        <div class="projects-slider-item__bg grid-x align-middle align-center">
            <div>
                <video :id="'video-' + project.id" playsinline loop muted autoplay>
                    <source :src="getVideoPath()" type="video/mp4">
                    Your browser does not support the video tag.
                </video>
            </div>
        </div>
        <div class="projects-slider-item__title grid-x align-middle">
            <div class="cell small-9 small-offset-1">
                <h1 v-if="alive">
                    <span class="title--inner" v-for="(titleString, titleIndex) in projectArrayTitle" :key="titleIndex"><span>{{ titleString }}</span></span>
                </h1>

                <div v-if="!titleComputed" class="title--innerfake"><span :id="project.id" :class="projectIndex">{{ project.title }}</span></div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import WebGLCompiler from "../components-ts/WebGLCompiler";
import SliderVideoBG from "../components-ts/SliderVideoBG";
import Utils from "../utils/Utils";
import * as PIXI from "pixi.js";

@Component
export default class ProjectsSliderItem extends Vue {
  projectArrayTitle: Array<string> = [];
  titleComputed: boolean = false;
  videoElement: HTMLVideoElement;
  videoBG: SliderVideoBG;
  inited: boolean = false;

  testImg: string = '';

  loopsPath: string = "dist/assets/loops/";
  wrapperId: string = "html-video-wrapper_";

  @Prop() project: any;
  @Prop() projectIndex: number;
  @Prop({ default: false })
  alive: boolean;
  @Prop({ default: false })
  moving: boolean;

  created() {
    this.wrapperId = this.wrapperId + this.project.title;
  }

  getVideoPath(): String {
    return "/dist/assets/loops/" + this.project.id + "-mobile.mp4";
  }

  mounted() {
    this.projectArrayTitle = Utils.lineBreaksToArray(document.getElementById(
      this.project.id
    ) as Element);
    this.titleComputed = true;

    this.videoElement = document.getElementById("video-" + this.project.id) as HTMLVideoElement;
    this.videoBG = new SliderVideoBG(
      this.project.title,
      this.videoElement,
      this.alive
    );
  }

  freezeVideo() {
    this.videoBG.freezeVideo();
  }

  unfreezeVideo() {
    this.videoBG.unfreezeVideo();
  }

  @Watch("alive", { immediate: false, deep: false })
  onAliveChanged(val: boolean, oldVal: boolean) {
    if (val) this.unfreezeVideo();
  }

  @Watch("moving", { immediate: false, deep: false })
  onMovingChanged(val: boolean, oldVal: boolean) {
    if (val !== oldVal && val && this.alive) this.freezeVideo();
    else if (this.alive) this.unfreezeVideo();
  }
}
</script>

<style lang="scss" scoped>
@import "../style/main.scss";
$titleAnimationDuration: 0.75s;
$titleAnimationMultilineDelay: 0.15s;

.html-video-wrapper {
  height: 100%;
  width: 100%;
}

.projects-slider-item {
  height: 100%;
  &__bg {
    height: 100%;
    overflow: hidden;
    background: black;
    &::after {
      content: "";
      position: absolute;
      top: -1px;
      left: -1px;
      right: -1px;
      bottom: -1px;
      background: radial-gradient(transparent, rgba(0,0,0,0.8));
    }
    img {
      height: 100%;
    }
    video {
      display: block;
    }
  }
  &__title {
    position: absolute;
    top: 0;
    height: 100%;
    width: 100%;
    text-align: left;
    .cell {
      margin-top: 35%;
    }
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
</style>