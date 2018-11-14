<template>
    <span class="image" :class="{'loading': loading}">
        <picture v-if="loadimage" :class="{'loaded': loaded}">
            <source media="(max-width: 375px)" :srcset="srcs[0]">
            <source media="(max-width: 750px)" :srcset="srcs[1]">
            <source media="(max-width: 1242px)" :srcset="srcs[2]">
            <img :src="srcs[2]" :alt="this.title" @load="onLoaded" :id="imgid">
        </picture>
        <loader v-if="loading && loader" class="loader"></loader>
    </span>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import Loader from "./loader.vue";

@Component({
  components: {
    Loader
  }
})
export default class ImageSrc extends Vue {
  private loading: boolean = true;
  private loaded: boolean = false;
  @Prop()
  srcs: Array<string>;
  @Prop()
  title: string;
  @Prop()
  loadimage: boolean;
  @Prop()
  loader: boolean;
  @Prop()
  imgid: string;

  onLoaded(): void {
    this.loading = false;
    this.loaded = true;
  }
}
</script>

<style lang="scss" scoped>
@import "../style/mixins.scss";
.image {
  position: relative;
  display: block;
  height: 100%;
  picture {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    @include opacity(0);
    @include transition(opacity 1.2s cubic-bezier(0.165, 0.84, 0.44, 1));
    &.loaded {
      @include opacity(1);
    }

  }
  .loader {
    display: block;
    position: absolute;
    z-index: 10;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
  }
}
</style>