<template>
  <div>
      <div class="other-title">plus</div>
      <div class="other-item" v-for="project in projects" :key="project.id">
          <a class="other-item-link" href="">
              <img class="other-item-link-bg" :src="project.id" :alt="project.title">
          </a>
      </div>
  </div>
</template>

<script lang="ts">
  import {Vue, Component, Prop, Emit} from 'vue-property-decorator'
  
  @Component
  export default class OtherProjects extends Vue {
    @Prop({type: Array, default: [{}] }) projects: Array<Object>

  }
</script>
