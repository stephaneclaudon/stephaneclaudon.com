<template>
  <div>
      <div>{{ videoPlayer() }}</div>
      <div class="details-credits">{{ project.credits }}</div>
      <other-projects></other-projects>
  </div>
</template>

<script lang="ts">
  import {Vue, Component, Prop, Emit} from 'vue-property-decorator'
  import OtherProjects from '../components/other-projects.vue'
  
  @Component({
    components: {
      OtherProjects
    }
  })
  export default class ProjectDetails extends Vue {
    /*@Prop({type: Array, default: [{}] })*/ projects: Array<Object> = [{}]
    @Prop({type: Object, default: {} }) project: Object

    videoPlayer () : String {
        return ''
    }
  }
</script>
