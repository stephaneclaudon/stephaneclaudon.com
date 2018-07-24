<template>
    <div class="gallery grid-x">
        <div class="gallery-cell cell" v-for="index in currentProject.gallerycount" :key="index" :class="getGridClasses(index)">
            <image-src :srcs="getImageSrc(index)" :title="currentProject.title" :loadimage="loadimages"></image-src>
        </div>
    </div>
</template>

<script lang="ts">
import { State } from "vuex-class";
import { Vue, Component, Prop } from "vue-property-decorator";
import ImageSrc from "./image.vue";

@Component({
  components: {
    ImageSrc
  }
})
export default class Gallery extends Vue {
  @State("currentProject") currentProject: any;
  @Prop() loadimages: boolean;
  private imagePath: string = process.mediaPath + "img/";

  getImageSrc(imageIndex: number): Array<string> {
    let srcs: Array<string> = [
      this.imagePath + this.currentProject.id + "/" + imageIndex + "@3x.jpg",
      this.imagePath + this.currentProject.id + "/" + imageIndex + "@3x.jpg",
      this.imagePath + this.currentProject.id + "/" + imageIndex + "@3x.jpg"
    ];
    return srcs;
  }

  getGridClasses(index: number): string {
    let rest: number = index % 3;
    let isBig: boolean = rest === 0;
    let classes: string = isBig ? "small-12" : "small-6";
    return classes;
  }
}
</script>

<style lang="scss" scoped>
@import "../style/variables.scss";
.gallery {
  overflow: hidden;
  width: 100%;
  &-cell {
    height: 42vw;
    overflow: hidden;
    border: solid 5px $black;
    box-sizing: border-box;

    img {
      height: 100%;
    }
  }
}
</style>