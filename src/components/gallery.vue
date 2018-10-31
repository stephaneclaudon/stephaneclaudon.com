<template>
  <div class="gallery grid-x">
    <div class="cell large-12" v-on:mousemove="onMouseMove($event)">
      <image-src class="gallery-large-view" :srcs="currentImageSrc" :title="currentProject.title" :loadimage="true"></image-src>
    </div>
    <div class="gallery-cell cell" v-for="index in currentProject.gallerycount" :key="index" :class="getGridClasses(index)" v-on:mouseover="setCurrentPicture(index)" v-on:pointerdown="setCurrentPicture(index)">
      <image-src :srcs="getImageSrc(index)" :title="currentProject.title" :loadimage="loadimages"></image-src>
    </div>
  </div>
</template>

<script lang="ts">
import { State } from "vuex-class";
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import ImageSrc from "./image.vue";
import Utils from "../utils/Utils";

@Component({
  components: {
    ImageSrc
  }
})
export default class Gallery extends Vue {
  @State("currentProject") currentProject: any;
  @Prop() loadimages: boolean;
  private imagePath: string = process.mediaPath + "img/";
  private currentImageSrc: Array<string> = [];

  mounted(): void {
    this.currentImageSrc = this.getImageSrc(1);
  }

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

  setCurrentPicture(index: number): void {
    this.currentImageSrc = this.getImageSrc(index);
  }

  onMouseMove(event: MouseEvent): void {
    var target : HTMLElement = (event.target as HTMLElement).offsetParent as HTMLElement
    var parentDimensions = target.getBoundingClientRect();
    var xPosition = event.clientX - parentDimensions.left;
    var imgIndex = Math.floor((xPosition / parentDimensions.width) * this.currentProject.gallerycount)
    this.setCurrentPicture(imgIndex + 1);
  }
}
</script>

<style lang="scss">
@import "../style/variables.scss";
.gallery {
  overflow: hidden;
  width: 100%;
  background-color: $white;
  &-large-view {
    display: none;
  }
  &-cell {
    height: 42vw;
    overflow: hidden;
    border: solid 5px $black;
    box-sizing: border-box;
    cursor: pointer;

    img {
      height: 100%;
    }
  }
  /* Large and up */
  @media screen and (min-width: 64em) {
    &-large-view {
      /* height: 20.70vw !important; */
      display: block;
      .image {
        height: auto !important;
        width: 100% !important;
      }
      img {
        height: auto !important;
        width: 100% !important;
      }
    }
    &-cell {
      display: none;
    }
  }
}
</style>