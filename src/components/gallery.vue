<template>
  <div class="gallery grid-x">
    <div class="gallery-large-view" v-on:mousemove="onMouseMove($event)">
      <image-src class="gallery-large-view--image" :srcs="currentImageSrc" :title="currentProject.title" :loadimage="true"></image-src>
    </div>
    <div class="gallery-cell cell" v-for="index in currentProject.gallerycount" :key="index" :class="getGridClasses(index)" v-on:click="zoomOnPicture(index, $event)">
      <image-src :srcs="getImageSrc(index)" :title="currentProject.title" :loadimage="loadimages"></image-src>
    </div>

    <transition
      name="zoom-animation"
      v-on:after-enter="zoomAfterEnter"
      v-on:before-leave="zoomBeforeLeave"
    >
      <div v-show="zoomImageIndex > -1" class="gallery-zoom" v-on:click="closeZoom()" :style="zoomDomStyle" :class="{'zoom-active': zoomActive}">
        <image-src :srcs="currentImageZoomSrc" :title="currentProject.title" :loadimage="true"></image-src>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import * as ModernizrObject from "modernizr";
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
  private currentImageZoomSrc: Array<string> = [];
  private zoomImageIndex: number = -1;
  private zoomDomStyle: string = "";
  private zoomActive: boolean = false;

  get Modernizr(): any {
    return ModernizrObject;
  }

  mounted(): void {
    this.currentImageSrc = this.getImageSrc(1);
    this.currentImageZoomSrc = this.getImageSrc(1);
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

  zoomOnPicture(index: number, event: MouseEvent): void {
    this.zoomImageIndex = index;
    this.currentImageZoomSrc = this.getImageSrc(index);
    var target = (event.target as HTMLElement);
    this.zoomDomStyle = '';
    this.zoomDomStyle += 'width: ' + target.parentElement!.clientWidth + 'px;';
    this.zoomDomStyle += 'height: ' + target.parentElement!.clientHeight + 'px;';
    this.zoomDomStyle += 'top: ' + target.parentElement!.getBoundingClientRect().top + 'px;';
    this.zoomDomStyle += 'left: ' + target.parentElement!.getBoundingClientRect().left + 'px;';
  }

  closeZoom(): void {
    this.zoomImageIndex = -1;
  }

  onMouseMove(event: MouseEvent): void {
    if (!ModernizrObject.touchevents) {
      var target : HTMLElement = (event.target as HTMLElement).offsetParent as HTMLElement
      var parentDimensions = target.getBoundingClientRect();
      var xPosition = event.clientX - parentDimensions.left;
      var imgIndex = Math.floor((xPosition / parentDimensions.width) * this.currentProject.gallerycount)    
      this.setCurrentPicture(imgIndex + 1);
    }
  }

  zoomAfterEnter(): void {
    this.zoomActive = true;
  }

  zoomBeforeLeave(): void {
    this.zoomActive = false;
  }
}
</script>

<style lang="scss">
@import "../style/variables.scss";
@import "../style/mixins.scss";

.gallery {
  overflow: hidden;
  width: 100%;
  background-color: $white;
  &-large-view {
    width: 100%;
    display: none;
    &--image {
      display: none;
      position: inherit;
      img {
        height: 100vh !important;
      }
    }
  }
  &-cell {
    height: 42vw;
    overflow: hidden;
    border: solid 5px $black;
    box-sizing: border-box;
    cursor: pointer;

    img {
      height: 100%;
      @include transition(transform 500ms ease-out);
    }
  }
  /* Large and up */
  @media screen and (min-width: 64em) {
    &-large-view {
      height: 100%;
      display: block;
      &--image {
        display: block;
        img {
          height: 100% !important;
          width: auto !important;
        }
      }
      
    }
    &-cell {
      display: none;
    }
  }

  &-zoom {
    overflow: hidden;
    position: fixed;
    z-index: 99;
    visibility: hidden;
    
    img {
      min-height: 100%;
    }
  }
}
.zoom-animation-enter-active, .zoom-animation-leave-active {
  @include transition(all 200ms cubic-bezier(0.165, 0.84, 0.44, 1));
}

.zoom-animation-enter-to, .zoom-active {
  width: 100% !important;
  height: 100% !important;
  top: 0 !important;
  left: 0 !important;
  visibility: visible;
}
</style>