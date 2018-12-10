<template>
  <div class="project-details" :class="{'aftertransition': visible, 'initialasing': !inited}" :style="transformOriginStyle">
    <div class="grid-x" :style="transformStyle">
      <div class="cell small-12 large-6">
        <div class="project-details-header">
          <div class="project-details-header-bg" :style="headerBackgroundStyle"></div>
          <div class="project-details-header-overlay"></div>
          <router-link class="project-details-back-button" :to="{ name: 'home' }" :class="{'firstpage': isFirstPage}">
            <close-button></close-button>
          </router-link>
          <div v-if="visible" class="grid-x align-center-middle project-details-header-text">
            <div class="cell small-10">
              <projects-slider-item-title :style="headerTitleStyle" class="project-details-header-text--title" :project="currentProject" :project-index="0" :alive="true" :moving="false" :link="false"></projects-slider-item-title>
              <div class="project-details-header-text--description">
                <p>{{ currentProject['description' + lang] }}</p>
              </div>

              <component v-if="currentProject.customdescription" class="project-details-header-text--custom" v-bind:is="camelCaseProjectId()"></component>

              <div class="project-details-header-text--credits cell small-10 align-text-center">
                <h2>Credits</h2>
                <p v-check-internal-link v-html="currentProject['credits' + lang]"></p>
                <div class="project-details-credits-date">{{ currentProject['date' + lang] }}</div>
              </div>
            </div>
          </div>   
        </div>
      </div>

      <div class="cell small-12 large-6">
        <div class="grid-x project-details--right">
          <div class="project-details-description cell small-10 small-offset-1">
            <p>{{ currentProject['description' + lang] }}</p>
          </div>

          <div v-if="currentProject.customdescription" class="separator"></div>

          <component v-if="currentProject.customdescription" class="project-details-custom cell small-10 small-offset-1" v-bind:is="camelCaseProjectId()"></component>

          <div class="separator"></div>

          <div class="cell small-10 small-offset-1 large-12 large-offset-0 project-details-gallery">
            <gallery class="project-details-gallery__item" :loadimages="visible"></gallery>
          </div>

          <div class="separator"></div>
            
          <embed-video-player class="cell small-10 small-offset-1 large-12 large-offset-0 project-details-video" :visible="visible" :videoId="currentProject.videoid" :plateform="currentProject.videoplateform"></embed-video-player>

          <div class="project-details-credits cell small-10 small-offset-1">
            <h2>Credits</h2>
            <p v-check-internal-link v-html="currentProject['credits' + lang]"></p>
            <div class="project-details-credits-date">{{ currentProject['date' + lang] }}</div>
          </div>
        </div>
      </div>
    </div>

   
  </div>
</template>

<script lang="ts">
import { State, Mutation } from "vuex-class";
import { Vue, Component, Prop, Emit, Watch } from "vue-property-decorator";
import OtherProjects from "../components/other-projects.vue";
import EmbedVideoPlayer from "../components/embedVideoPlayer.vue";
import CloseButton from "../components/closeButton.vue";
import ProjectsSliderItemTitle from "./projects-slider-item-title.vue";
import Gallery from "./gallery.vue";
import Utils from "../utils/Utils";
import audiQuattro2SkiTheWorld from "./custom/audiQuattro2SkiTheWorld.vue";

@Component({
  components: {
    OtherProjects,
    EmbedVideoPlayer,
    CloseButton,
    ProjectsSliderItemTitle,
    Gallery,
    audiQuattro2SkiTheWorld
  }
})
export default class ProjectDetails extends Vue {
  @State("lang") lang: string;
  @State("currentProject") currentProject: any;
  @Prop() visible: boolean;
  @Prop() transformOriginStyle: string;
  @Prop() transformStyle: string;
  currentScroll: number;
  headerBackgroundImage: string;
  headerBackgroundStyle: string = "";
  headerTitleStyle: string = "";

  private inited: boolean = false;
  private isFirstPage: boolean = false;

  mounted(): void {
    this.onProjectChanged(null, null);
    this.inited = true;
  }

  camelCaseProjectId(): string {
    return Utils.camelCase(this.currentProject.id);
  }

  @Watch("currentProject")
  onProjectChanged(val: any, old: any): void {
    this.isFirstPage = window.history.length === process.originalHistoryLength;
    this.headerBackgroundImage =
      'background-image: url("' +
      process.mediaPath +
      "img/" +
      this.currentProject.id +
      '@3x.jpg");';
    this.headerBackgroundStyle = this.headerBackgroundImage;
  }
}
</script>
<style lang="scss" scoped>
@import "../style/mixins.scss";
@import "../style/variables.scss";

@keyframes slideAndFadeEntry {
  from {
    @include transform(translateY(-2em));
    @include opacity(0);
  }
  to {
    @include transform(translateY(0));
    @include opacity(1);
  }
}

.project-details {
  position: absolute;
  top: 0;
  background: $black;
  width: 100%;
  min-height: 100%;
  padding-bottom: 3em;
  overflow: hidden;

  &.initialasing {
    display: block !important;
  }

  .grid-x {
    height: 100%;
  }

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

  .separator {
    width: 33%;
    height: 1px;
    border-top: solid 1px $grey;
    margin: 4em auto ;/* Large and up */
    @media screen and (min-width: 64em) {
      display: none;
    }
  }

  &-header {
    padding-top: 5em;
    padding-bottom: 5em;
    height: 30vh;
    width: 100%;
    position: relative;
    overflow: hidden;

    &-bg, &-overlay {
      z-index: 1;
      position: absolute;
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
    }

    &-bg {
      background-position: center;
      background-size: cover;
    }

    &-overlay {
      z-index: 2;
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
      &--custom {
        display: none;
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

      &-bg {
        @include filter(blur(20px));
        @include transform(scale(1.2));
      }

      &-overlay {
        @include background(rgba(0, 0, 0, 0.8));
      }

      &-text--description,
      &-text--credits,
      &-text--custom {
        display: block;
        @include opacity(0);
        @include transform(translateY(-2em));
        @include animation-timing-function(cubic-bezier(0.165, 0.84, 0.44, 1));
      }

      &-text--description {
        @include animation(0.5s, 1s, slideAndFadeEntry);
      }

      &-text--custom {
        @include animation(0.65s, 1s, slideAndFadeEntry);
      }

      &-text--credits {
        @include animation(0.75s, 1s, slideAndFadeEntry);
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
    position: fixed;
    top: 50px;
    left: 50px;
    z-index: 4;
    display: none;
    align-items: center;
    justify-content: center;
    height: 50px;
    width: 50px;
    transform: translate(-50%, -50%);
    /* Large and up */
    @media screen and (min-width: 64em) {
      display: flex;
    }

    &.firstpage {
      display: flex;
      transform: translate(50%, -50%);
      right: 50px;
      left: auto;
    }
  }
  &-gallery {

    &__item {
      height: 100%;
    }
    /* large and up */
    @media screen and (min-width: 64em) {
      flex-basis: inherit;
      flex: 1;
      &__item {
        flex: auto;
        margin: 0;

        &::after {
          display: none;
        }
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
      text-align: right;
      /* Large and up */
      @media screen and (min-width: 64em) {
        text-align: inherit;
      }
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
  &-custom {

    /* Large and up */
    @media screen and (min-width: 64em) {
      &::after {
        display: none;
      }
      display: none;
    }
  }

  &-description {
    padding: 4em 0 0 0;
    p {
      font-size: 1.1em;
    }
  }
}
</style>