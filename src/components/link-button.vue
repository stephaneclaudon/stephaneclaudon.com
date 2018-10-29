<template>
  <router-link :to="to" class="button button-outer">
    <span class="button-bg"></span>
    <span class="button-inner">{{ title }}</span>
  </router-link>
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

  @Prop()
  to: string
}
</script>

<style lang="scss" scoped>
@import "../style/mixins.scss";
@import '../style/fonts.scss';
$border-width: 2px;
$border-du: 400ms;

@mixin button-border-animation ($ease-height, $ease-width) {
  position: absolute;
  content: "";
  display: block;
  width: 0%;
  height: 0%;
  background-color: white;
  @include transition(height $ease-height cubic-bezier(0.165, 0.84, 0.44, 1), width $ease-width cubic-bezier(0.165, 0.84, 0.44, 1))
}

.button {
  display: inline-block;
  position: relative;
  text-align: center;
  text-transform: uppercase;
  
  &:focus {
    outline: 0;
  }

  &:hover, &.active {
    .button-inner {
      color: rgba(0,0,0, 1);
    }

    &::before, .button-inner::before {
      height: 100%;
    }
    
    &::after, .button-inner::after {
      width: 100%;
    }

    .button-bg {
      @include opacity(1);
      @include transform(scaleX(1) scaleY(1));
    }
  }

  &-bg {
    position: absolute;
    z-index: -1;
    content: "";
    display: block;
    background-color: white;
    top: $border-width * 2;
    bottom: $border-width * 2;
    left: $border-width * 2;
    right: $border-width * 2;
    @include box-sizing(border-box);
    @include transform(scaleX(0.9625) scaleY(0.869565));
    @include opacity(0); 
    @include transition(opacity $border-du cubic-bezier(0.165, 0.84, 0.44, 1), transform $border-du cubic-bezier(0.165, 0.84, 0.44, 1));

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
    font-size: 0.4em;
    @include roboto-black;
    background-color: transparent;
    cursor: pointer;
    padding: 1.4em 3em;
    display: inline-block;
    border: $border-width solid rgba(255,255,255, 0.5);
    color: rgba(255,255,255, 1);
    transition: color $border-du;
    &::before, &::after {
      top: 0;
			left: 0;
			z-index: 1;
    }
  }
}
</style>