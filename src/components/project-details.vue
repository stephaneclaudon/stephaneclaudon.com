<template>
  <div class="project-details grid-x">
      <div class="project-details-video">{{ videoPlayer() }}</div>
      <div class="project-details-credits cell small-10 small-offset-1">
        <h2>Credits</h2>
        <p>{{ currentProject.credits }}</p>
      </div>
      <other-projects></other-projects>
  </div>
</template>

<script lang="ts">
  import { State, Mutation } from 'vuex-class'
  import {Vue, Component, Prop, Emit} from 'vue-property-decorator'
  import OtherProjects from '../components/other-projects.vue'
  
  @Component({
    components: {
      OtherProjects
    }
  })
  export default class ProjectDetails extends Vue {
    @State('projects') projects: Array<Object>
    @State('currentProject') currentProject: Object

    videoPlayer () : String {
        return ''
    }
  }
</script>
<style lang="scss" scoped>
  @import '../style/main.scss';

  .project-details {
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