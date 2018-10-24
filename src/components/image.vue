<template>
    <span class="image" :class="{'loading': loading}">
        <picture v-if="loadimage">
            <source media="(max-width: 375px)" :srcset="srcs[0]">
            <source media="(max-width: 750px)" :srcset="srcs[1]">
            <source media="(max-width: 1242px)" :srcset="srcs[2]">
            <img :src="srcs[2]" :alt="this.title" @load="loaded">
        </picture>
        <loader v-if="loading" class="loader"></loader>
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
  @Prop()
  srcs: Array<string>;
  @Prop()
  title: string;
  @Prop()
  loadimage: boolean;

  loaded(): void {
    this.loading = false;
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

    img {
      height: 100%;
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