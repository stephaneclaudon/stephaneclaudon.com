<template>
  <div class="project-details grid-x">
      
      <div class="project-details-header cell small-10 small-offset-1">
        <div class="grid-x">
          <div class="cell small-1">
            <router-link class="project-details-back-button" :to="{ name: 'home' }">
              <close-button></close-button>
            </router-link>
          </div>
          <div class="cell small-10">
            <projects-slider-item-title :project="currentProject" :project-index="0" :alive="true" :moving="false"></projects-slider-item-title>
            <!--<h1 class="project-details-header--client">{{ currentProject.client }}</h1>
            <h2 class="project-details-header--title">{{ currentProject.title }}</h2>-->
          </div>
          
        </div>        
      </div>

      <embed-video-player class="project-details-video" :visible="visible" :videoId="currentProject.videoid" :plateform="currentProject.videoplateform"></embed-video-player>

      <div class="project-details-credits cell small-10 small-offset-1">
        <h2>Credits</h2>
        <p>{{ currentProject.credits }}</p>
      </div>

      <!--<other-projects></other-projects>-->
  </div>
</template>

<script lang="ts">
  import { State, Mutation } from 'vuex-class'
  import {Vue, Component, Prop, Emit} from 'vue-property-decorator'
  import OtherProjects from '../components/other-projects.vue'
  import EmbedVideoPlayer from '../components/embedVideoPlayer.vue'
  import CloseButton from '../components/closeButton.vue'
  import ProjectsSliderItemTitle from "./projects-slider-item-title.vue";
  
  @Component({
    components: {
      OtherProjects,
      EmbedVideoPlayer,
      CloseButton,
      ProjectsSliderItemTitle
    }
  })
  export default class ProjectDetails extends Vue {
    @State('projects') projects: Array<Object>;
    @State('currentProject') currentProject: Object;
    @Prop() visible: boolean;
  }
</script>
<style lang="scss">
  @import '../style/main.scss';

  .project-details {
    position: absolute;
    top: 0;
    background: $black;
    width: 100%;
    min-height: 100%;

    &-back-button {
      display: inline-block;
    }

    &-header {
      text-align: center;
      margin-top: 2em;
      margin-bottom: 2em;
      
      &--client {
        font-size: 1em;
      }
      &--title {
        font-size: 2em;
      }
    }
    &-video {
      
    }
    &-credits {
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
    }

    .projects-slider-item__title {
      .title--innerfake, .title--inner {
        font-size: 1.2em;
      }
      .title--outer:first-child {
        .title--innerfake, .title--inner {
          font-size: 1.2em;
        }
      } 
      .title--inner {
        span, &::before, &::after {
          @include animation-duration(0.01s !important);
          @include animation-delay(0.01s !important);
        }
      }
    }
  }

</style>