<template>
    <div class="projects-slider-item__title">
        <h1 v-if="alive">
          <span class="title--inner" v-for="(titleString, titleIndex) in projectArrayTitle" :key="titleIndex"><span>{{ titleString }}</span></span>
        </h1>

        <div v-if="!titleComputed" class="title--innerfake"><span :id="project.id" :class="projectIndex"><span>{{ project.client   + " \n"}}</span> <br /><span>{{ project.title }}</span></span></div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import Utils from "../utils/Utils";

@Component
export default class ProjectsSliderItem extends Vue {
  projectArrayTitle: Array<string> = [];
  titleComputed: boolean = false;
  inited: boolean = false;

  @Prop() project: any;
  @Prop() projectIndex: number;
  @Prop({ default: false })
  alive: boolean;

  mounted() {
    this.projectArrayTitle = Utils.lineBreaksToArray(document.getElementById(
      this.project.id
    ) as Element);
    this.titleComputed = true;
  }
}
</script>

<style lang="scss" scoped>
@import "../style/main.scss";
$titleAnimationDuration: 0.75s;
$titleAnimationMultilineDelay: 0.15s;

.projects-slider-item__title {
  .title--inner,
  .title--innerfake {
    position: relative;
    display: inline-block;
    z-index: 200;
    padding: 0.5em;
    vertical-align: middle;
    text-transform: uppercase;
    font-size: 2em;
    white-space: pre-line;
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
  @for $i from 0 through 10 {
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
</style>