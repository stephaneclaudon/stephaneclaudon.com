<template>
  <div class="project-details grid-x">
      <div class="cell small-10 small-offset-1">
        <router-link class="project-details-back-button" :to="{ name: 'home' }">
          <close-button></close-button>
        </router-link>
      </div>

      <div class="project-details-header cell small-10 small-offset-1">
        <h1 class="project-details-header--client">{{ currentProject.client }}</h1>
        <h2 class="project-details-header--title">{{ currentProject.title }}</h2>
      </div>

      <embed-video-player class="project-details-video" :videoId="currentProject.videoid" :plateform="currentProject.videoplateform"></embed-video-player>

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
  
  @Component({
    components: {
      OtherProjects,
      EmbedVideoPlayer,
      CloseButton
    }
  })
  export default class ProjectDetails extends Vue {
    @State('projects') projects: Array<Object>
    @State('currentProject') currentProject: Object
  }
</script>
<style lang="scss" scoped>
  @import '../style/main.scss';

  .project-details {
    position: absolute;
    top: 0;
    background: $black;
    padding: 2em 0 2em 0;

    &-back-button {
      text-align: right;
    }

    &-header {
      color: $light-grey;
      letter-spacing: 0.05em;
      text-align: center;
      text-transform: uppercase;
      margin-top: 2em;
      margin-bottom: 2em;
      &--client {
        @include roboto-light;
        font-size: 1.5em;
      }
      &--title {
        @include roboto-black;
        font-size: 2.5em;
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
  }

</style>