<template>
  <div class="app grid-container full">

    <projects-slider></projects-slider>
    <project-details v-if="this.currentProject.id" :project="this.currentProject"></project-details>

    <div class="name-wrapper">
      <div class="grid-x">
        <div class="cell small-10 small-offset-1">
          <div class="main-name">
            <div class="main-name__first">Stéphane</div>
            <div class="main-name__last">CLAUDON</div>
          </div>
        </div>
      </div>
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

  .name-wrapper {
    position: absolute;
    top: 5%;
    width: 100%;
  }

  .main {
    &-name {
      @include opacity(0);
      @keyframes mainName {
        from {@include opacity(0);}
        to {@include opacity(1);}
      }
      @include animation(1s, 1s, mainName);
      animation-timing-function: ease-out;
      text-transform: uppercase;
      &__first {
        @include roboto-light;
        font-size: 1em;
        letter-spacing: 0.72em;
      }
      &__last {
        @include roboto-black;
        font-size: 1.93em;
        letter-spacing: 0.105em;
      }
    }
  }
</style>
