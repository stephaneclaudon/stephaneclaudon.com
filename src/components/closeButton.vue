<template>
  <div class="close-button">
      <div class="outer">
        <div class="inner">
            <label>Back</label>
        </div>
    </div>
  </div>
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

.close-button {
  .outer {
    display: inline-block;
    width: 1.8em;
    height: 1.8em;
    cursor: pointer;
  }

  .inner {
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
    height: 1px;
    width: inherit;
    background: #ffffff;
    left: 0;
    @include transition(all 0.1s ease-in-out);
  }

  .inner:before {
    top: 50%;
    @include transform(rotate(45deg));
  }

  .inner:after {
    bottom: 50%;
    @include transform(rotate(-45deg));
  }

  .outer:hover label {
    @include opacity(1);
  }

  .outer:hover .inner:before,
  .outer:hover .inner:after {
    @include transform(rotate(0));
  }

  .outer:hover .inner:before {
    top: 0;
  }

  .outer:hover .inner:after {
    bottom: 0;
  }
}
</style>