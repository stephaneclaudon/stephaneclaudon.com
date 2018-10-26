<template>
  <a href="" class="button button-outer">
    <span class="button-inner">{{ title }}</span>
  </a>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component({
  components: {
  }
})
export default class LinkButton extends Vue {
  @Prop()
  title: string
}
</script>

<style lang="scss" scoped>
@import "../style/mixins.scss";
$border-width: 1px;
$border-du: 0.3s;

@mixin button-border-animation ($ease-height, $ease-width) {
  position: absolute;
  content: "";
  display: block;
  width: 0%;
  height: 0%;
  background-color: white;
  transition: height $border-du ease-out $ease-height, width $border-du ease-out $ease-width;
}

.button {
  display: inline-block;
  position: relative;
  text-align: center;
  text-transform: uppercase;
  font-size: 0.5em;
  
  &:focus {
    outline: 0;
  }

  &:hover {
    .button-inner {
      color: rgba(255,255,255, 1);
    }

    &::before, .button-inner::before {
      height: 100%;
    }
    
    &::after, .button-inner::after {
      width: 100%;
    }
  }

  
  &::before, &::after {
    background-color: white;
    right: 0;
    bottom: 0;
    z-index: 10;
  }

  &-outer, &-inner {
    &::before {
      @include button-border-animation($border-du, 0s);
      width: $border-width;
    }
    
    &::after {
      @include button-border-animation(0s, $border-du);
		  height: $border-width;
    }
  }
  
  &-inner {
    background-color: transparent;
    cursor: pointer;
    padding: 1em 2em;
    display: inline-block;
    border: $border-width solid rgba(255,255,255, 0.5);
    color: rgba(255,255,255, 0.5);
    transition: color $border-du;
    &::before, &::after {
      top: 0;
			left: 0;
			z-index: 1;
    }
  }
}
</style>