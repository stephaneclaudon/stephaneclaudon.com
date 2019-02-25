<template>
  <div class="video-player" :style="cssStyle">
    <iframe @load="iframeLoaded" v-if="loadVideoPlayer && plateform === 'vimeo' && isMounted && visible" :src="vimeoURL" :width="width" :height="height" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen allow="autoplay; fullscreen"></iframe>
    <iframe @load="iframeLoaded" v-if="loadVideoPlayer && plateform === 'youtube' && isMounted && visible" :src="youtubeURL" :width="width" :height="height" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen allow="autoplay; fullscreen"></iframe>
    <iframe @load="iframeLoaded" v-if="loadVideoPlayer && plateform === 'facebook' && isMounted && visible" :src="facebookURL" :width="width" :height="height" scrolling="no" frameborder="0" allowTransparency="true" allow="encrypted-media" allowFullScreen="true" webkitallowfullscreen mozallowfullscreen></iframe>
    
    <div class="video-player--poster" v-if="!showVideoPlayer" v-on:click="loadIframe()" :class="{'loading': loadVideoPlayer}">
      <image-src class="video-player--poster__image" :srcs="getVideoPosterSrc()" :title="currentProject.title" :loadimage="true" :loader="false"></image-src>
      <span class="video-player-play-button">
        <span></span>
      </span>
      <loader class="video-player-loader"></loader>
    </div>
  </div>
</template>

<script lang="ts">
import { State, Mutation } from "vuex-class";
import * as MutationTypes from "../store/mutation-types";
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import ImageSrc from "./image.vue";
import Loader from "./loader.vue";

@Component({
  components: {
    ImageSrc,
    Loader
  }
})
export default class EmbedVideoPlayer extends Vue {
  @State("currentProject") currentProject: any;
  @Prop() plateform: string;
  @Prop() videoId: string;
  @Prop() visible: boolean;

  @Mutation(MutationTypes.SET_CURRENT_PROJECT_DIMENSIONS)
  commitCurrentProjectDimensions: (dimensions: Object) => void;

  private isMounted: boolean = false;
  private loadVideoPlayer: boolean = false;
  private showVideoPlayer: boolean = false;
  private videoRatio: number = 0;
  private width: number = 0;
  private height: number = 0;
  private pcHeight: number = 0;
  private cssStyle: string = "";

  private imagePath: string = process.mediaPath + "img/";
  private containerSize: any;

  mounted() {
    this.isMounted = true;
    this.showVideoPlayer = false;
    if (this.currentProject.id) this.updateSize();
  }

  @Watch("currentProject")
  onProjectChanged(val: any, old: any): void {
    this.updateSize();
  }

  @Watch("visible")
  onVisibilityChanged(val: any, old: any): void {
    if (!val) {
      this.loadVideoPlayer = false;
      this.showVideoPlayer = false;
    }
  }

  updateSize(): void {
    this.setDimensions();
    this.setStyle();
    this.showVideoPlayer = false;
    this.loadVideoPlayer = false;
  }

  loadIframe(): void {
   this.loadVideoPlayer = true;
  }

  setDimensions(): void {
    this.videoRatio = (this.currentProject.videoheight / this.currentProject.videowidth);
    if (!this.containerSize) {
      this.containerSize = {width: 0, height: 0, pcheight: 0.5, pcWidth: 0.5};
      this.containerSize.width = this.$el.getBoundingClientRect().width;
      this.containerSize.pcWidth = this.containerSize.width / process.viewportSize.width;
    }

    this.containerSize.height = this.containerSize.width * this.videoRatio;
    this.containerSize.pcheight = this.containerSize.height / process.viewportSize.height;
    this.width = Math.floor(this.containerSize.width);
    this.height = Math.floor(this.width * this.videoRatio);
    this.pcHeight = this.containerSize.pcheight;

    this.commitCurrentProjectDimensions({videoPcHeight: this.pcHeight, galleryPcHeight: 1 - this.pcHeight});
  }
  
  setStyle(): void {
    this.cssStyle = "height: " + (this.pcHeight * 100) + "vh;";
  }

  getVideoPosterSrc(): Array<string> {
    let srcs: Array<string> = [
      this.imagePath + this.currentProject.id + "@1x.jpg",
      this.imagePath + this.currentProject.id + "@2x.jpg",
      this.imagePath + this.currentProject.id + "@3x.jpg",
    ];
    return srcs;
  }

  get vimeoURL(): string {
    let url: string = "https://player.vimeo.com/video/";
    url += this.videoId + "?";

    let options: any = {
      autoplay: "1",
      color: "ffffff",
      title: "0",
      byline: "0",
      portrait: "0"
    };
    url += this.serializeURLParameters(options);
    return url;
  }

  get youtubeURL(): string {
    let url: string = "http://www.youtube.com/embed/";
    url += this.videoId + "?";

    let options: any = {
      autoplay: "1",
      origin: "http://stephaneclaudon.com"
    };
    url += this.serializeURLParameters(options);
    return url;
  }

  get facebookURL(): string {
    let url: string = "https://www.facebook.com/plugins/video.php?";
    //url += this.videoId + "?";

    let options: any = {
      href: "https://www.facebook.com/facebook/videos/10155038627933204/&",
      show_text: "false",
      autoplay: "true",
      height: this.height,
      width: this.width,
      allowfullscreen: true,
      origin: "http://stephaneclaudon.com"
    };
    url += this.serializeURLParameters(options);
    return url;
  }

  iframeLoaded(): void {
    this.showVideoPlayer = !this.showVideoPlayer;
  }

  serializeURLParameters(params: any): string {
    let keys: Array<string> = Object.getOwnPropertyNames(params);
    let result: string = "";
    keys.forEach(key => {
      result += key + "=" + params[key] + "&";
    });
    result = result.slice(0, -1);

    return result;
  }
}
</script>

<style lang="scss">
@import "../style/mixins.scss";

.video-player {
  width: 100%;
  position: relative;

  /* small and Medium only */
  @media screen and (max-width: 63.9375em) {
    /*height: auto !important;*/
  }

  &:hover {
    .video-player-play-button {
      @include transform(translateX(-50%) translateY(-50%) scale(1.2));
    }
    .video-player--poster__image {
      @include opacity(0.7);
    }
  }

  iframe {
    position: absolute;
    top: 0;
    left: 0;
  }

  &--poster {
    cursor: pointer;
    position: relative;
    height: 100%;
    overflow: hidden;
    &.loading {
      .video-player-play-button {
        display: none;
      }
      .video-player-loader {
        display: block;
      }
      img {
        @include opacity(0.5);
      }
    }

    &__image {
      width: 100%;
      height: 100%;
      @include transition(opacity 200ms cubic-bezier(0.165, 0.84, 0.44, 1));
    }
    
    img {
      height: 100%;
      width: auto;
      max-width: inherit;
    }
  }

  

  &-play-button {
    position: absolute;
    z-index: 10;
    top: 50%;
    left: 50%;
    @include transform(translateX(-50%) translateY(-50%));
    box-sizing: content-box;
    display: block;
    width: 32px;
    height: 44px;
    border-radius: 50%;
    padding: 18px 20px 18px 28px;
    @include transition(transform 200ms cubic-bezier(0.165, 0.84, 0.44, 1));
    
    span {
      display: block;
      position: relative;
      z-index: 3;
      width: 0;
      height: 0;
      border-left: 32px solid #fff;
      border-top: 22px solid transparent;
      border-bottom: 22px solid transparent;
    }
  }

  &-loader {
    display: none;
    position: absolute;
    z-index: 10;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
  }
}
</style>