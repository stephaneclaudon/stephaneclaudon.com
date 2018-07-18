<template>
  <div class="project-details grid-x" :class="{'aftertransition': visible}">
    <div class="project-details-header" :style="headerBackgroundStyle">
      <div class="project-details-header-overlay"></div>
      <router-link class="project-details-back-button" :to="{ name: 'home' }">
        <close-button></close-button>
      </router-link>
      <div class="grid-x align-middle project-details-header-text">
        <div class="cell small-10 small-offset-1">
          <projects-slider-item-title :style="headerTitleStyle" class="project-details-header-text--title" :project="currentProject" :project-index="0" :alive="true" :moving="false"></projects-slider-item-title>
          <!--<h1 class="project-details-header--client">{{ currentProject.client }}</h1>
          <h2 class="project-details-header--title">{{ currentProject.title }}</h2>-->
        </div>
      </div>   
    </div>

    <div class="project-details-description cell small-10 small-offset-1">
      <p>{{ currentProject.description }}</p>
    </div>

    <div class="cell small-10 small-offset-1">
      <div class="grid-x">
        <gallery class="project-details-gallery" :loadimages="visible"></gallery>
      </div>
    </div>
      
    <embed-video-player class="cell small-10 small-offset-1 project-details-video" :visible="visible" :videoId="currentProject.videoid" :plateform="currentProject.videoplateform"></embed-video-player>

    <div class="project-details-credits cell small-10 small-offset-1">
      <h2>Credits</h2>
      <p>{{ currentProject.credits }}</p>
      <div class="align-text-center project-details-credits-date">{{ currentProject.date }}</div>
    </div>

    <!--<other-projects></other-projects>-->
  </div>
</template>

<script lang="ts">
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
  currentScroll: number;
  headerBackgroundImage: string;
  headerBackgroundStyle: string = "";
  headerTitleStyle: string = "";

  mounted(): void {
    window.addEventListener('scroll', this.onWindowScroll);
    this.headerBackgroundImage = 'background-image: url("/dist/assets/img/' + this.currentProject.id + '@3x.jpg");';
    this.onWindowScroll();
  }

  onWindowScroll(): void {
    this.currentScroll = window.pageYOffset;
    this.setHeaderStyle();
  }

  setHeaderStyle(): void {
    this.headerBackgroundStyle = this.headerBackgroundImage + ' background-position: center ' + this.currentScroll * 0.7 + 'px;';
    this.headerTitleStyle = 'margin-top: ' + this.currentScroll * 0.9 + 'px;';
  }

  beforeDestroy(): void {
    window.removeEventListener('scroll', this.onWindowScroll);
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
    margin: 2em 0;
  }

  &-video {
  }

  &-credits, &-description {
    color: $grey;
    padding: 2em 0;
    font-size: 1.2em;

    h2 {
      text-transform: uppercase;
      line-height: 1em;
      margin: 0 0 2em 0;
    }
    p {
      white-space: pre-wrap;
      word-wrap: break-word;
      line-height: 1.3em;
    }

    &-date {
      padding: 2em 0;
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