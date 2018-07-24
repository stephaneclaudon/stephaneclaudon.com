<template>
    <div :id="wrapperId" class="html-video-wrapper projects-slider-item">
        <div class="projects-slider-item__bg grid-x align-middle align-center">
            <div>
                <video :id="'video-' + project.id" playsinline loop muted autoplay>
                    <source :src="getVideoPath()" type="video/mp4">
                    Your browser does not support the video tag.
                </video>
            </div>
        </div>
        <div class="projects-slider-item__title-container grid-x align-middle">
            <div class="cell small-9 small-offset-1">
                <projects-slider-item-title :project="project" :project-index="projectIndex" :alive="alive"></projects-slider-item-title>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import SliderVideoBG from "../components-ts/SliderVideoBG";
import ProjectsSliderItemTitle from "./projects-slider-item-title.vue";
import Utils from "../utils/Utils";

@Component({
  components: {
    ProjectsSliderItemTitle
  }
})
export default class ProjectsSliderItem extends Vue {
  projectArrayTitle: Array<string> = [];
  titleComputed: boolean = false;
  videoElement: HTMLVideoElement;
  videoBG: SliderVideoBG;
  inited: boolean = false;

  testImg: string = '';

  loopsPath: string = "dist/assets/loops/";
  wrapperId: string = "html-video-wrapper_";

  @Prop() project: any;
  @Prop() projectIndex: number;
  @Prop({ default: false })
  alive: boolean;
  @Prop({ default: false })
  moving: boolean;

  created() {
    this.wrapperId = this.wrapperId + this.project.title;
  }

  getVideoPath(): String {
    return process.mediaPath + "loops/" + this.project.id + "-mobile.mp4";
  }

  mounted() {
    this.projectArrayTitle = Utils.lineBreaksToArray(document.getElementById(
      this.project.id
    ) as Element);
    this.titleComputed = true;

    this.videoElement = document.getElementById("video-" + this.project.id) as HTMLVideoElement;
    this.videoBG = new SliderVideoBG(
      this.project.title,
      this.videoElement,
      this.alive
    );
  }

  freezeVideo() {
    this.videoBG.freezeVideo();
  }

  unfreezeVideo() {
    this.videoBG.unfreezeVideo();
  }

  @Watch("alive", { immediate: false, deep: false })
  onAliveChanged(val: boolean, oldVal: boolean) {
    if (val) this.unfreezeVideo();
  }

  @Watch("moving", { immediate: false, deep: false })
  onMovingChanged(val: boolean, oldVal: boolean) {
    if (val !== oldVal && val && this.alive) this.freezeVideo();
    else if (this.alive) this.unfreezeVideo();
  }
}
</script>

<style lang="scss" scoped>
@import '../style/mixins.scss';
@import '../style/variables.scss';

.html-video-wrapper {
  height: 100%;
  width: 100%;
}

.projects-slider-item {
  height: 100%;
  &__bg {
    height: 100%;
    overflow: hidden;
    background: black;
    &::after {
      content: "";
      position: absolute;
      top: -1px;
      left: -1px;
      right: -1px;
      bottom: -1px;
      background: radial-gradient(transparent, rgba(0,0,0,0.8));
    }
    img {
      height: 100%;
    }
    video {
      display: block;
    }
  }
  &__title-container {
    position: absolute;
    top: 0;
    height: 100%;
    width: 100%;
    text-align: left;
    .cell {
      margin-top: 35%;
    }
  }
}
</style>