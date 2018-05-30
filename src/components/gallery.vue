<template>
    <div class="gallery grid-x">
        <div class="gallery-cell cell" v-for="index in currentProject.gallerycount" :key="index" :class="getGridClasses(index)">
            <picture>
                <source media="(max-width: 375px)" :srcset="getImageAt(index, '2x')">
                <source media="(max-width: 750px)" :srcset="getImageAt(index, '2x')">
                <source media="(max-width: 1242px)" :srcset="getImageAt(index, '3x')">
                <img :src="getImageAt(index, '3x')" :alt="currentProject.title">
            </picture>
        </div>
    </div>
</template>

<script lang="ts">
import { State } from "vuex-class";
import { Vue, Component } from "vue-property-decorator";

@Component
export default class Gallery extends Vue {
  @State("currentProject") currentProject: any;

  private imagePath: string = "/dist/assets/img/";

  getImageAt(imageIndex: number, size: string): string {
    let path: string =
      this.imagePath +
      this.currentProject.id +
      "/" +
      imageIndex +
      "@" +
      "3x"+//size +
      ".jpg";
    return path;
  }

  getGridClasses(index: number): string {
    let rest: number = index % 3;
    let isBig: boolean = (rest === 0);
    let classes: string = isBig ? "small-12" : "small-6";
    return classes;
  }
}
</script>

<style lang="scss" scoped>
.gallery {
    overflow: hidden;
  &-cell {
      height: 50vw;
      overflow: hidden;
      display: flex;
      justify-content: center;

      img {
        height: 100%;
      }
  }
}
</style>