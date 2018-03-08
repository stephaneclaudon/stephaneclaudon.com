<template>
  <div>

    <projects-slider></projects-slider>

    <div class="main-name">
      <div class="main-name__first">Stéphane</div>
      <div class="main-name__last">CLAUDON</div>
    </div>

    <contact-box></contact-box> 

  </div>
</template>

<script lang="ts">
  import {Vue, Component, Prop} from 'vue-property-decorator'
  import ContactBox from './components/contact.vue'
  import ProjectsSlider from './components/projects-slider.vue'

  @Component({
    components: {
      ContactBox,
      ProjectsSlider
    }
  })
  export default class App extends Vue {
    @Prop({type: Number, default: 0}) initnumero: number
    numero: number = 0

    mounted () {
      window.setInterval(() => {
        this.numero++
      }, 1000)
    }

  }
</script>
