<template>
  <div class="project-details grid-x" ref="projectDetails" :class="{'aftertransition': visible}">

    <div class="cell small-12 large-6">
      <div class="project-details-header" :style="headerBackgroundStyle">
        <div class="project-details-header-overlay"></div>
        <router-link class="project-details-back-button" :to="{ name: 'home' }">
          <close-button></close-button>
        </router-link>
        <div class="grid-x align-center-middle project-details-header-text">
          <div class="cell small-10">
            <projects-slider-item-title :style="headerTitleStyle" class="project-details-header-text--title" :project="currentProject" :project-index="0" :alive="true" :moving="false" :link="false"></projects-slider-item-title>
            <div class="project-details-header-text--description">
              <p>{{ currentProject.description }}</p>
            </div>
            <div class="project-details-header-text--credits cell small-10 align-text-center">
              <h2>Credits</h2>
              <p v-html="currentProject.credits"></p>
              <div class="project-details-credits-date">{{ currentProject.date }}</div>
            </div>
          </div>
        </div>   
      </div>
    </div>

    <div class="cell small-12 large-6">
      <div class="grid-x project-details--right">
        <div class="project-details-description cell small-10 small-offset-1">
          <p>{{ currentProject.description }}</p>
        </div>

        <div class="cell small-10 small-offset-1 large-12 large-offset-0 project-details-gallery">
          <gallery class="project-details-gallery__item" :loadimages="visible"></gallery>
        </div>
          
        <embed-video-player class="cell small-10 small-offset-1 large-12 large-offset-0 project-details-video" :visible="visible" :videoId="currentProject.videoid" :plateform="currentProject.videoplateform"></embed-video-player>

        <div class="project-details-credits cell small-10 small-offset-1">
          <h2>Credits</h2>
          <p v-html="currentProject.credits"></p>
          <div class="project-details-credits-date">{{ currentProject.date }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import * as ModernizrObject from "modernizr";
import { State, Mutation } from "vuex-class";
import { Vue, Component, Prop, Emit } from "vue-property-decorator";
import OtherProjects from "../components/other-projects.vue";
import EmbedVideoPlayer from "../components/embedVideoPlayer.vue";
import CloseButton from "../components/closeButton.vue";
import ProjectsSliderItemTitle from "./projects-slider-item-title.vue";
import Gallery from "./gallery.vue";

@Component({
  components: {
    OtherProjects,
    EmbedVideoPlayer,
    CloseButton,
    ProjectsSliderItemTitle,
    Gallery
  }
})
export default class ProjectDetails extends Vue {
  @State("currentProject") currentProject: any;
  @Prop() visible: boolean;
  @Prop() transitioning: boolean;
  currentScroll: number;
  headerBackgroundImage: string;
  headerBackgroundStyle: string = "";
  headerTitleStyle: string = "";

  get Modernizr(): any {
    return ModernizrObject;
  }

  mounted(): void {
    //window.addEventListener("scroll", this.onWindowScroll);
    this.headerBackgroundImage =
      'background-image: url("' +
      process.mediaPath +
      "img/" +
      this.currentProject.id +
      '@3x.jpg");';
    this.onWindowScroll();
    setInterval(() => {
      // console.log((this.$refs.projectDetails as any).clientHeight);
    }, 500)
  }

  onWindowScroll(): void {
    this.currentScroll = window.pageYOffset;
    this.setHeaderStyle();
  }

  setHeaderStyle(): void {
    this.headerBackgroundStyle =
      this.headerBackgroundImage +
      " background-position: center " +
      this.currentScroll * 0.7 +
      "px;";
    this.headerTitleStyle = "margin-top: " + this.currentScroll * 0.9 + "px;";
  }

  beforeDestroy(): void {
    window.removeEventListener("scroll", this.onWindowScroll);
  }
}
</script>
<style lang="scss" scoped>
@import "../style/mixins.scss";
@import "../style/variables.scss";

.project-details {
  position: absolute;
  top: 0;
  background: $black;
  width: 100%;
  min-height: 100%;
  padding-bottom: 3em;

  /* Large and up */
  @media screen and (min-width: 64em) {
    padding-bottom: 0;
    height: 100%;
    &--right {
      display: flex;
      align-content: center;
      align-items: center;
    }
  }
  
  &.aftertransition {
    position: relative;
  }

  &-header {
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    padding-top: 5em;
    padding-bottom: 5em;
    height: 30vh;
    width: 100%;
    position: relative;

    &-overlay {
      z-index: 1;
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      @include vertical-gradient(transparent, $black, 30%, 100%);
    }
    &-text {
      height: 100%;
      z-index: 2;
      position: relative;

      &--title {
        text-align: center;

        .title--innerfake,
        .title--inner {
          font-size: 1.8em;
        }
        .title--outer:first-child {
          .title--innerfake,
          .title--inner {
            font-size: 1.5em;
          }
        }
        .title--inner {
          span,
          &::before,
          &::after {
            @include animation-duration(0.01s !important);
            @include animation-delay(0.01s !important);
          }
        }
      }
      &--description {
        display: none;
        color: $white;
        text-align: center;
        font-size: 1.5em;
        margin-top: 2em;
      }
      &--credits {
        display: none;
        padding: 4em 0 0 0;
      }
    }
    &--client,
    &--title {
      position: relative;
      z-index: 4;
    }

    &--client {
      font-size: 1.5em;
    }
    &--title {
      font-size: 2.5em;
    }

    /* Large and up */
    @media screen and (min-width: 64em) {
      position: fixed;
      height: 100%;
      width: 50%;
      padding-top: 0em;

      &-overlay {
        @include vertical-gradient(
          rgba(0, 0, 0, 0.5),
          rgba(0, 0, 0, 1),
          30%,
          100%
        );
      }

      &-text--description,
      &-text--credits {
        display: block;
      }
    }
  }

  &--right {
    height: 100%;
    min-height: 100%;
    display: flex;
    flex-direction: column;
  }

  &-back-button {
    position: absolute;
    top: 2em;
    right: 8.333333333%;
    z-index: 4;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50px;
    width: 50px;
    transform: translate(50%, -50%);
    margin-top: 6px;
    margin-left: -6px;
  }
  &-gallery {

    &__item {
      height: 100%;
      margin: 2em 0;
    }
    /* large and up */
    @media screen and (min-width: 64em) {
      flex-basis: inherit;
      flex: 1;
      &__item {
        flex: auto;
        margin: 0;
      }
    }
  }

  &-video {
  }

  &-header-text--credits,
  &-credits,
  &-description {
    color: $grey;
    font-size: 1.2em;

    h2 {
      text-transform: uppercase;
      line-height: 1em;
      margin: 0 0 2em 0;
    }
    p {
      white-space: pre-line;
      word-wrap: break-word;
      line-height: 1.3em;
    }

    &-date {
      padding: 2em 0;
    }
  }

  &-credits,
  &-description {
    padding: 2em 0;
    /* Large and up */
    @media screen and (min-width: 64em) {
      display: none;
    }
  }

  &-description {
    padding: 4em 0 2em 0;
    p {
      font-size: 1.1em;
    }
  }
}
</style>