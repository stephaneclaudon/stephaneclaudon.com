<template>
  <div>

    <projects-slider :projects="this.data"></projects-slider>

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

  @Component({
    components: {
      ContactBox,
      ProjectsSlider
    }
  })
  export default class App extends Vue {
    data: Array<Object> = jsonData

    mounted () {
    }

  }
</script>
