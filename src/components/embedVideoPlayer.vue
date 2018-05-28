<template>
  <div class="video-player">
    <iframe v-if="plateform === 'vimeo' && isMounted && visible" :src="vimeoURL" :width="width" :height="height" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
  </div>
</template>

<script lang="ts">
import {
  Vue,
  Component,
  Prop
} from "vue-property-decorator";

@Component({
  components: {
  }
})
export default class EmbedVideoPlayer extends Vue {
  @Prop() plateform: string;
  @Prop() videoId: string;
  @Prop() visible: boolean;

  private isMounted: boolean = false;

  mounted() {
    this.isMounted = true;
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

<style lang="scss" scoped>
  @import "../style/main.scss";
  .video-player {
    width: 100%;
    height: 56vw;
  }
</style>