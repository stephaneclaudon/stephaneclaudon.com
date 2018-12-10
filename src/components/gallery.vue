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
      <div v-show="zoomImageIndex > -1" class="gallery-zoom" v-on:click="closeZoom()" :style="zoomDomStyle" :class="getZoomClass()" ref="zoomContainer">
        <image-src :srcs="currentImageZoomSrc" :title="currentProject.title" :loadimage="true" :imgid="'zoomImageElement'" :transition="false" :style="zoomImageDomStyle"></image-src>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import * as ModernizrObject from "modernizr";
import { State } from "vuex-class";
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import ImageSrc from "./image.vue";
import { TweenLite, Power4 } from "gsap";
//@ts-ignore
import * as Draggable from "gsap/Draggable";
//@ts-ignore
import * as BodyScrollLock from 'body-scroll-lock';

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


  private zoomContainer: HTMLElement;
  private currentImageZoomSrc: Array<string> = [];
  private zoomImageIndex: number = -1;
  private zoomDomClass: string = "";
  private zoomDomStyle: string = "";
  private zoomImageDomStyle: string = "";
  private zoomActive: boolean = false;

  private dragData: any;
  private dragMaxVelocity: number = 15;
  private dragVelocity: number = 0;
  private beforeDragPosX: number = 0;
  private dragAmount: number = 0;
  private dragDirection: number = 0;
  private dragTween: TweenLite;
  private draggableZoom: any;

  get Modernizr(): any {
    return ModernizrObject;
  }

  mounted(): void {
    this.zoomContainer = this.$refs.zoomContainer as HTMLElement;
    this.dragTween = new TweenLite(this, 0.1, {});
    if (this.currentProject.id) this.currentImageSrc = this.getImageSrc(1);
  }

  @Watch("currentProject")
  onProjectChanged(val: any, old: any): void {
    this.currentImageSrc = this.getImageSrc(1);
  }

  getImageSrc(imageIndex: number): Array<string> {
    let srcs: Array<string> = [
      this.imagePath + this.currentProject.id + "/" + imageIndex + ".jpg",
      this.imagePath + this.currentProject.id + "/" + imageIndex + ".jpg",
      this.imagePath + this.currentProject.id + "/" + imageIndex + ".jpg"
    ];
    return srcs;
  }

  getGridClasses(index: number): string {
    let rest: number = index % 3;
    let isBig: boolean = rest === 0;
    let classes: string = isBig ? "small-12" : "small-6";
    return classes;
  }

  getZoomClass(): string {
    return ((this.zoomActive)?'zoom-active ':'') + this.zoomDomClass;
  }

  setCurrentPicture(index: number): void {
    this.currentImageSrc = this.getImageSrc(index);
  }

  zoomOnPicture(index: number, event: MouseEvent): void {
    this.zoomImageIndex = index;
    this.currentImageZoomSrc = this.getImageSrc(index);
    var target = (event.target as HTMLElement);
    let targetSize: any = {width: target!.clientWidth, height: target!.clientHeight};
    let targetContainerSize: any = {width: target.parentElement!.clientWidth, height: target.parentElement!.clientHeight};
    this.zoomDomStyle = '';
    this.zoomDomStyle += 'width: ' + targetContainerSize.width + 'px;';
    this.zoomDomStyle += 'height: ' + targetContainerSize.height + 'px;';
    this.zoomDomStyle += 'top: ' + target.parentElement!.getBoundingClientRect().top + 'px;';
    this.zoomDomStyle += 'left: ' + target.parentElement!.getBoundingClientRect().left + 'px;';

    // If large image
    this.zoomDomClass = (targetContainerSize.width / targetContainerSize.height > 1.5) ? 'large' : 'small';
    //handle screen ratio
    this.zoomDomClass += (process.viewportSize.width < process.viewportSize.widthheight) ? ' portrait' : ' landscape';

    this.zoomImageDomStyle = ModernizrObject.prefixedCSS('transform') + ': scale(' + (targetSize.height / targetContainerSize.height) + ');';    
  }

  closeZoom(): void {
    this.zoomImageIndex = -1;
    TweenLite.set(this.draggableZoom.target, {clearProps:"transform"});
    this.draggableZoom.kill();
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
    BodyScrollLock.disableBodyScroll(this.$refs.zoomContainer);
    this.$nextTick(() => {
      let zoomedImgElt: HTMLElement = document.getElementById('zoomImageElement')!;      
      let bounds: any = {top: zoomedImgElt.offsetTop, left: zoomedImgElt.offsetLeft*2, width: zoomedImgElt.offsetWidth + Math.abs(zoomedImgElt.offsetLeft * 2), height: zoomedImgElt.offsetHeight}
      this.draggableZoom = new Draggable(zoomedImgElt, {type:"x", edgeResistance:0.85, bounds: bounds, throwProps:false});
    })
  }

  zoomBeforeLeave(): void {
    this.zoomActive = false;
    BodyScrollLock.enableBodyScroll(this.$refs.zoomContainer);
  }
}
</script>

<style lang="scss">
@import "../style/variables.scss";
@import "../style/mixins.scss";

.gallery {
  overflow: hidden;
  width: 100%;
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
    border: solid 1px $black;
    box-sizing: border-box;
    cursor: pointer;

    img {
      height: 100%;
      @include transition(transform 500ms ease-out);
    }

    &.small-12 img{
      width: 100%;
      height: auto;
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

    .image {
      @include transition(transform 200ms cubic-bezier(0.165, 0.84, 0.44, 1));

      img {
        height: 100%;
        min-height: 100%;
        @include transition(transform 200ms cubic-bezier(0.165, 0.84, 0.44, 1));
        @include transform(translate3d(0, 0, 0));
      }
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

  .image {
    @include transform(scale(1) !important);
  }
}
</style>