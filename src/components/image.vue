<template>
    <div>
        <picture>
            <source media="(max-width: 375px)" :srcset="getImageAt('2x')">
            <source media="(max-width: 750px)" :srcset="getImageAt('2x')">
            <source media="(max-width: 1242px)" :srcset="getImageAt('3x')">
            <img :src="getImageAt('3x')" :alt="this.title">
        </picture>
    </div>
</template>

<script lang="ts">
  import {Vue, Component, Prop} from 'vue-property-decorator'
  import OtherProjects from '../components/other-projects.vue'
  
  @Component
  export default class ImageSrc extends Vue {
    imagePath: string = 'dist/assets/img/'
    @Prop()
    name: string
    @Prop()
    title: string

    getImageAt(size: string): string {
        let path: string = this.imagePath + this.name + '@' + size + '.jpg'
        return path
    }

  }
</script>

<style lang="scss" scoped>
    img {
        max-width: 100%;
    }
</style>