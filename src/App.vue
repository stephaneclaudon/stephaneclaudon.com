<template>
  <div>

    <projects-slider v-on:viewproject="viewProject"></projects-slider>
    <project-details v-if="this.currentProject" :project="this.currentProject"></project-details>

    <div class="main-name">
      <div class="main-name__first">Stéphane</div>
      <div class="main-name__last">CLAUDON</div>
    </div>

    <contact-box></contact-box>

  </div>
</template>

<script lang="ts">
  import { Mutation } from 'vuex-class'
  import {Vue, Component, Prop, Provide, Inject, Model} from 'vue-property-decorator'
  import ContactBox from './components/contact.vue'
  import ProjectsSlider from './components/projects-slider.vue'
  import ProjectDetails from './components/project-details.vue'
  import jsonData from './assets/data/data.json'
  import * as MutationTypes from './store/mutation-types'
  
  @Component({
    components: {
      ContactBox,
      ProjectsSlider,
      ProjectDetails
    }
  })
  export default class App extends Vue {
    
    //@State('siteData') stateSiteData: Array<Object>
    @Mutation(MutationTypes.LOAD_PROJECTS)
    loadProject: (projects: Array<Object>) => void

    

    //siteData: Array<Object> = jsonData
    currentProject: any = {}

    viewProject( project: any ) {
      this.currentProject = project
      console.log('app view project', this.currentProject.title)
    }

    mounted () {
    }

    created () {
      this.loadProject( jsonData )
    }

  }
</script>
