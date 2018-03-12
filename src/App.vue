<template>
  <div>

    <projects-slider :projects="this.siteData" v-on:viewproject="viewProject"></projects-slider>
    <project-details v-if="this.currentProject" :project="this.currentProject" :projects="this.siteData"></project-details>

    <div class="main-name">
      <div class="main-name__first">Stéphane</div>
      <div class="main-name__last">CLAUDON</div>
    </div>

    <contact-box></contact-box>

  </div>
</template>

<script lang="ts">
  import {Vue, Component, Prop, Provide, Inject, Model} from 'vue-property-decorator'
  import jsonData from './assets/data/data.json'
  import ContactBox from './components/contact.vue'
  import ProjectsSlider from './components/projects-slider.vue'
  import ProjectDetails from './components/project-details.vue'

  @Component({
    components: {
      ContactBox,
      ProjectsSlider,
      ProjectDetails
    }
  })
  export default class App extends Vue {
    siteData: Array<Object> = jsonData
    
    @Prop()
    currentProject: any

    viewProject( project: any ) {
      this.currentProject = project
      console.log('app view project', this.currentProject.title)
    }

    mounted () {
    }

  }
</script>
