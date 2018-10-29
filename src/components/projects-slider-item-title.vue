<template>
    <div class="projects-slider-item__title">
        <h1 v-if="alive && titleComputed">
          <span class="title--outer" v-for="(titleString, titleIndex) in projectArrayTitle" :key="titleIndex">
            <span class="title--inner"><span>{{ titleString }}</span></span>
            <br />
          </span>
        </h1>

        <div v-if="link" class="projects-slider-item__title--description align-text-center">
          {{ project.description }}
        </div>

        <div v-if="link" class="align-text-center projects-slider-item__title--link">
          <link-button class="link-button" :class="{'visible': !moving && alive}" :title="'view work'" :to="'/project/' + project.id"></link-button>
        </div>

        <div v-if="!titleComputed" class="title--innerfake"><span ref="innerfake" :id="project.id" :class="projectIndex"><span>{{ project.client   + " \n"}}</span> <br /><span>{{ project.title }}</span></span></div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import Utils from "../utils/Utils";
import LinkButton from "./link-button.vue";

@Component({
  components: {
    LinkButton
  }
})
export default class ProjectsSliderItem extends Vue {
  projectArrayTitle: Array<string> = [];
  titleComputed: boolean = false;
  inited: boolean = false;

  @Prop() link: boolean;
  @Prop() project: any;
  @Prop() projectIndex: number;
  @Prop({ default: false })
  alive: boolean;
  @Prop({ default: false })
  moving: boolean;

  mounted() {
    this.projectArrayTitle = Utils.lineBreaksToArray(this.$refs
      .innerfake as Element);
    this.titleComputed = true;
  }
}
</script>

<style lang="scss" scoped>
@import '../style/mixins.scss';
@import '../style/variables.scss';
@import '../style/fonts.scss';
$titleAnimationDuration: 0.75s;
$titleAnimationMultilineDelay: 0.15s;

.projects-slider-item__title {
  &--link {
    text-align: left;
    .link-button {
      pointer-events: fill;
      margin: 2em 0 0 0;
      z-index: 999;
      @include opacity(0);
      @include transition(opacity 750ms ease-out 0.1s);
      &.visible {
        @include opacity(1);
      }
    }
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
  .title--outer:not(:last-child) .title--inner::before {
    border-bottom: solid 1px $black;
  }
  .title--outer:first-child {
    .title--innerfake,
    .title--inner {
      font-size: 1.5em;
      span {
        @include roboto-light;
      }
    }
    .title--inner {
      color: $black;
      &::before {
        @include horizontal-gradient(#bbbbbb, #fdfbfb);
      }
    }
  }
  @for $i from 0 through 10 {
    .title--outer:nth-child(#{$i}) .title--inner {
      span {
        @include animation(
          #{$i * $titleAnimationMultilineDelay + $titleAnimationDuration * 0.5},
          0.01s,
          textAnim
        );
      }
      &::before {
        @include animation(
          #{$i * $titleAnimationMultilineDelay + $titleAnimationDuration * 0.5},
          0.01s,
          gradientBG
        );
      }
      &::after {
        @include animation(
          #{$i * $titleAnimationMultilineDelay},
          $titleAnimationDuration,
          blackBG
        );
      }
    }
  }

  &--description {
    display: none;
    font-size: 0.5em;
    margin-top: 1em;
  }

  /* Large and up */
  @media screen and (min-width: 64em) {
    font-size: 3em;
    text-align: center;

    .title--inner {
      padding: 0;
      span {
        visibility: visible;
      }
    }

    .title--outer:first-child .title--inner {
      color: $white;
    }

    .title--inner::before, .title--inner::after, .title--outer::before, .title--outer::after, .title--outer:first-child .title--inner::before, .title--outer:first-child .title--inner::after  {
      border-bottom: none !important;
      background: none;
    }

    &--description {
      display: block;
    }

    &--link {
      text-align: center;
      font-size: 0.4em;
    }
  }
}
</style>