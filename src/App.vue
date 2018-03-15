<template>
  <div class="app">

    <projects-slider></projects-slider>
    <project-details v-if="this.currentProject.id" :project="this.currentProject"></project-details>

    <div class="main-name">
      <div class="main-name__first">Stéphane</div>
      <div class="main-name__last">CLAUDON</div>
    </div>

    <contact-box></contact-box>

  </div>
</template>

<script lang="ts">
  import { State, Mutation } from 'vuex-class'
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
    @State('currentProject') currentProject: Object
    
    @Mutation(MutationTypes.LOAD_PROJECTS)
    loadProject: (projects: Array<Object>) => void

    created () {
      this.loadProject( jsonData )
    }

  }
</script>

<style lang="scss">
  @import './style/main.scss';

  .main {
    &-name {
      position: absolute;
      top: 100px;
      left: 100px;
      text-transform: uppercase;
      &__first {
        @include roboto-light;
        font-size: 41px;
        letter-spacing: 0.72em;
      }
      &__last {
        @include roboto-black;
        font-size: 80px;
        letter-spacing: 0.1em;
      }
    }
  }
</style>
