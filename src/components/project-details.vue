<template>
  <div>
      <div>{{ videoPlayer() }}</div>
      <div class="details-credits">{{ currentProject.credits }}</div>
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
