<template>
  <span class="outer">
    <span class="inner">
      <label>Close</label>
    </span>
  </span>
</template>

<script lang="ts">
import {
  Vue,
  Component,
} from "vue-property-decorator";

@Component({
  components: {
  }
})
export default class CloseButton extends Vue {

}
</script>

<style lang="scss" scoped>
@import "../style/main.scss";


  .outer {
    line-height: 1;
    vertical-align: middle;
    display: inline-block;
    width: 18px;
    height: 18px;
    cursor: pointer;
  }

  .inner {
    display: block;
    width: inherit;
    text-align: center;
    position: relative;
    line-height: inherit;
    height: inherit;
  }

  label {
    font-size: 0.8em;
    line-height: 4em;
    text-transform: uppercase;
    color: #ffffff;
    @include transition(all 0.1s ease-in-out);
    @include opacity(0);
    cursor: pointer;
  }

  .inner:before,
  .inner:after {
    position: absolute;
    content: "";
    height: 2px;
    width: inherit;
    background: #ffffff;
    left: 0;
  }

  .inner:before {
    top: 8px;
    @include transform(rotate(45deg));
  }

  .inner:after {
    bottom: 8px;
    @include transform(rotate(-45deg));
  }
</style>