<template>
    <div class="page page-4">
        <span class="border-indicator">
        </span>
        <ol class="ol-4" :class="'active-' + currentIndex">
          <li v-for="index in pageCount" :key="index" class="circle" @click="goToIndex(index - 1)"></li>
        </ol>
    </div>
</template>

<script lang="ts">
import * as MutationTypes from "../store/mutation-types";
import { State, Mutation } from "vuex-class";
import { Vue, Component, Prop } from "vue-property-decorator";

@Component({
  components: {
  }
})
export default class Pagination extends Vue {
  @Prop() pageCount: number;
  @Prop() currentIndex: number;

  @Mutation(MutationTypes.SLIDER_SET_CURRENT_PROJECT_ID)
  setCurrentSliderIndex: (index: number) => void;

  goToIndex( index: number ): void {
    console.log(index);
    
    this.setCurrentSliderIndex(index);
  }

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
$full-opacity-color: rgba(255, 255, 255, 1.0);
$border-indicator-width: $circle-width + 4;
$circle-margin: 4px;

.page {
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
  margin: $circle-margin;
  background-color: $mid-opacity-color;
  cursor: pointer;
  @include transition(background-color 0.3s ease-out);
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
  margin-left: -($step * ($circle-width + $circle-margin * 2)) - ($border-indicator-width/2 + 1) ;
}

ol.ol-4 {
  list-style: none;
  padding: 0;
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  width: 117px;
  overflow: hidden;
  margin-left: -$border-indicator-width/2 - 1px;
  margin-top: -$border-indicator-width/2 - 1px;
  @include transition(all 0.3s ease-out);

  @for $i from 0 through 10 {
    &.active-#{$i} {
      @include move-circles-4 ($i);
      .circle:nth-child(#{$i+1}) {
        background-color: $full-opacity-color;
      }
    }
  }
}

</style>