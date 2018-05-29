<template>
  <div class="video-player">
    <div class="video-player--poster" v-if="!showVideoPlayer" v-on:click="toggleVideoPlayerVisibility">
      <image-src :name="project.id" :title="project.title"></image-src>
    </div>
    
    <iframe v-if="showVideoPlayer && plateform === 'vimeo' && isMounted && visible" :src="vimeoURL" :width="width" :height="height" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
  </div>
</template>

<script lang="ts">
import { State } from "vuex-class";
import {
  Vue,
  Component,
  Prop
} from "vue-property-decorator";
import ImageSrc from "./image.vue";

@Component({
  components: {
    ImageSrc
  }
})
export default class EmbedVideoPlayer extends Vue {
  @State('currentProject') project: Object;
  @Prop() plateform: string;
  @Prop() videoId: string;
  @Prop() visible: boolean;

  private isMounted: boolean = false;
  private showVideoPlayer: boolean = false;


  mounted() {
    this.isMounted = true;
    this.showVideoPlayer = false;
    
  }

  toggleVideoPlayerVisibility(): void {
    this.showVideoPlayer = !this.showVideoPlayer;
  }
  
  get vimeoURL(): string {
    let url: string = "https://player.vimeo.com/video/";
    url += this.videoId + "?";

    let options: any = {
      color: "ffffff",
      title: "0",
      byline: "0",
      portrait: "0"
    }
    url += this.serializeURLParameters(options);
    return url;
  }

  get width(): number {
    return this.$el.getBoundingClientRect().width;
  }

  get height(): number {
    // 16/9 ratio
    return this.width * 0.5625;
  }

  serializeURLParameters(params: any): string { 
    let keys: Array<string> = Object.getOwnPropertyNames(params);
    let result: string = "";
    keys.forEach((key) => {
      result += key + "=" + params[key];
    });
    
    return result; 
  }
}
</script>

<style lang="scss">
  @import "../style/main.scss";

  .video-player {
    width: 100%;
    height: 56vw;
    /*@keyframes videoPlayer {
      from {
        transform: scaleY(3.3) translateY(14%);
      }
      to {
        transform: scaleY(1) translateY(0);
      }
    }
    @include animation(0s, 0.3s, videoPlayer);
    @include animation-timing-function(ease-out);*/

    &--poster {
      height: 100%;
      > div {
        height: 100%;
        img {
          height: 100%;
        }
      }
    }
  }
</style>