<template>
  <div class="showreel-wrapper">
    <div class="toggle noselect" v-on:click="open()">
      <div class="toggle-content">Showreel</div>
    </div>
      
    <div class="showreel" v-bind:class="{ opened: opened, hidden: hidden }">
      <div class="showreel-overlay" v-on:click="close()"></div>
      <div ref="showreel" class="showreel-content grid-x align-center-middle">

        <div class="showreel-content__video small-12">
          <video ref="showreelVideoElt" :poster="getVideoPosterPath()" id="video" playsinline loop preload="none" controls crossorigin="anonymous">
            <source :src="getVideoPath()" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        <div class="showreel-content__back-button" v-on:click="close()">
          <close-button></close-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { State } from "vuex-class";
import { Vue, Component, Prop, Emit, Watch } from "vue-property-decorator";
import CloseButton from "../components/closeButton.vue";
import jsonData from "../assets/data/data.json";

//@ts-ignore
import * as BodyScrollLock from 'body-scroll-lock';

@Component({
  components: {
    CloseButton
  }
})
export default class ShowreelBox extends Vue {
  opened: boolean = false;
  hidden: boolean = true;
  jsonData: any = jsonData;

  private imagePath: string = process.mediaPath + "img/me.jpg";

  @State("lang") lang: string;

  @Emit()
  open(): void {
    this.$router.push("/showreel");
  }

  @Emit()
  close(): void {
    window.history.length > 1 && (window.history.length > process.originalHistoryLength)
      ? this.$router.go(-1)
      : this.$router.push("/");
  }

  @Watch("$route")
  onRouteChanged(to: any, from: any): void {
    if (
      from.name != to.name &&
      (from.name === "showreel" || to.name === "showreel")
    ) {
      this.toggle();
    }
  }

  created(): void {
    if (this.$router.currentRoute.name === "showreel") {
      this.toggle();
    }
  }

  getVideoPath(): String {
    let videoFileName: string = "showreel/claudon-showreel.mp4";
    return process.mediaPath + videoFileName;
  }

  getVideoPosterPath(): String {
    let videoFileName: string = "img/showreel.jpg";
    return process.mediaPath + videoFileName;
  }

  toggle() {
    this.opened = !this.opened;
    if (!this.opened) {
      setTimeout(() => {
        this.hidden = true;
      }, 500);

      BodyScrollLock.enableBodyScroll(this.$refs.showreel);
      BodyScrollLock.clearAllBodyScrollLocks();
      if (this.$refs.showreelVideoElt) {
        (this.$refs.showreelVideoElt as HTMLVideoElement).pause();
      }
    } else {
      this.hidden = false;
      BodyScrollLock.disableBodyScroll(this.$refs.showreel);
      if (this.$refs.showreelVideoElt) {
        (this.$refs.showreelVideoElt as HTMLVideoElement).play();
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../style/fonts.scss";
@import "../style/mixins.scss";
@import "../style/variables.scss";

.toggle {
  position: fixed;
  left: 8.3333%;
  bottom: 5%;
  width: auto;
  z-index: 999;
  display: inline-block;
  height: 50px;
  background-size: 73px 16px;
  font-size: 0.8em;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  cursor: pointer;
  @include transform-origin(0% 0% 0px);
  @include transform(rotate(-90deg) translateX(-50px) translateY(-50%));
  @include transition(color 0.2s);
  @include opacity(0);
  @include roboto-black;
  @keyframes showreelToggle {
    from {
      @include opacity(0);
    }
    to {
      @include opacity(1);
    }
  }
  @include animation(0.25s, 1s, showreelToggle);
  animation-timing-function: ease-out;

  &:hover {
    color: $light-grey;

    &-content {
      &::after {
        border-color: $light-grey;
      }
    }
  }

  &-content {
    @include transform(translateY(50%));
    &::after {
      content: "";
      display: block;
      width: 100%;
      border-bottom: solid 1px $white;
      margin-top: 5px;
      @include transition(border-color 0.2s);
    }
  }
}
.showreel-wrapper {
  position: fixed;
  bottom: 5%;
  width: auto;
  z-index: 999;

  /* Large and up */
  @media screen and (min-width: 64em) {
    margin-left: 0;
    .toggle {
      left: 50px;
      bottom: 50px;
    }
    .showreel-content {
    }
  }
}

.showreel {
  width: 100%;
  height: 100%;
  z-index: 1000;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;

  &-overlay {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgb(0, 0, 0);
    opacity: 0;
    @include transition(opacity 500ms cubic-bezier(0.39, 0.575, 0.565, 1) 0ms);
  }
  &-content {
    @include roboto-light;
    position: relative;
    background-color: $black;
    align-content: space-around;
    color: $white;
    width: 100%;
    min-height: 100%;
    bottom: 0px;
    @include transform(translate3d(0px, 100vh, 0px));
    @include transition(transform 500ms cubic-bezier(0.215, 0.61, 0.355, 1) 0ms);
    text-align: center;
    
    &__video {
      video {
        width: 100%;
        max-width: 1080px;
      }

      &:hover {
        .showreel-content__video-play-button {
          @include transform(translateX(-50%) translateY(-50%) scale(1.2));
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
    }
    

    &__back-button {
      position: absolute;
      top: 2em;
      right: 2em;
      z-index: 4;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 50px;
      width: 50px;
      transform: translate(50%, -50%);
      margin-top: 6px;
      margin-left: -6px;
    }

    /* Large and up */
    @media screen and (min-width: 64em) {
      &__video {
        video {
          width: auto;
          height: 100vh;
          max-height: 1080px;
        }
      }
    }
  }
  &.opened {
    visibility: visible;
    .showreel-overlay {
      opacity: 0.85;
    }
    .showreel-content {
      background: transparent;
      transform: translate3d(0px, 0px, 0px);
    }
  }
  &.hidden {
    visibility: hidden;
  }
}
</style>
