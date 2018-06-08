<template>
    <div class="page page-4">
        <span class="border-indicator">
        </span>
        <ol class="ol-4" :class="'active-' + currentIndex">
            <li v-for="index in pageCount" :key="index" class="circle circle-mid-opacity" :class="'circle-pg-' + index"></li>
        </ol>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component({
  components: {
  }
})
export default class Pagination extends Vue {
  @Prop() pageCount: number;
  @Prop() currentIndex: number;

}
</script>

<style lang="scss" scoped>
@import "../style/main.scss";

$circle-width: 10px;
$one-width-multiplier: 1.6;
$animation-length: 2s;
$rect-width: 20px;
$rect-height: 2px;
$mid-opacity-color: rgba(255, 255, 255, 0.5);
$border-indicator-width: $circle-width * 1.4;

.page {
  position: relative;
  height: 200px;
  display: flex;
  ol:not(.ol-4) {
    list-style: none;
    padding: 0;
    margin: auto;
    position: relative;
  }
}

.circle {
  display: inline-block;
  width: $circle-width;
  height: $circle-width;
  border-radius: 50%;
  margin: 4px;
}

.circle-mid-opacity {
  background-color: $mid-opacity-color;
}

.border-indicator {
  position: absolute;
  width: $border-indicator-width;
  height: $border-indicator-width;
  border-radius: 50%;
  border: 1px solid white;
  top: 50%;
  left: 50%;
  margin-top: -$border-indicator-width/2;
  margin-left: -$border-indicator-width/2;
}

@mixin move-circles-4 ($step) {
  margin-left: -$border-indicator-width/2 - ($step * 2 * $circle-width) ;
}

ol.ol-4 {
  list-style: none;
  padding: 0;
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  width: 117px;
  overflow-x: hidden;
  margin-left: -$border-indicator-width/2 - 1px;
  margin-top: -$border-indicator-width/2 - 1px;
  @include transition(all 0.3s ease-out);

  &.active-0 {
    @include move-circles-4 (0);
  }
  &.active-1 {
      @include move-circles-4 (1);
  }
  &.active-2 {
      @include move-circles-4 (2);
  }
  &.active-3 {
      @include move-circles-4 (3);
  }
  &.active-4 {
      @include move-circles-4 (4);
  }
  &.active-5 {
      @include move-circles-4 (5);
  }
  &.active-6 {
      @include move-circles-4 (6);
  }
  &.active-7 {
      @include move-circles-4 (7);
  }
}

</style>