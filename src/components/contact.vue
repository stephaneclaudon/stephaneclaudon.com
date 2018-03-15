<template>
  <div>
    <div class="toggle" v-on:click="toggle()">Contact</div>
    <div class="contact" v-bind:class="{ opened: opened }">
      <div class="contact-overlay" v-on:click="toggle()"></div>
      <div class="contact-content">
        <ul>
            <li class="contact-content__facebook">facebook</li>
            <li class="contact-content__vimeo">vimeo</li>
            <li class="contact-content__instagram">instagram</li>
        </ul>
        <div class="contact-content__phone">+336</div>
        <div class="contact-content__mail">hello@toto.com</div>
      </div>
    </div>
    
  </div>
</template>

<script lang="ts">
  import {Vue, Component, Prop, Emit} from 'vue-property-decorator'
  
  @Component
  export default class ContactBox extends Vue {
    opened: boolean = false
    
    @Emit()
    toggle(){ this.opened = !this.opened }
  }
</script>

<style lang="scss" scoped>
  @import '../style/main.scss';

  .toggle {
    position: fixed;
    bottom: 100px;
    left: 100px;
    width: 73px;
    height: 16px;
    background-size: 73px 16px;
    opacity: 1;
    transform: rotate(-90deg);
    transform-origin: 0% 100% 0px;
    visibility: visible;
    transition: opacity 2000ms cubic-bezier(0.445, 0.05, 0.55, 0.95) 500ms;
  }

  .contact {
    width: 100%;
    height: 100%;
    z-index: 100;
    visibility: hidden;
    position: fixed;
    top: 0;
    left: 0;

    &-overlay {
      position: absolute;
      width: 100%;
      height: 100%;
      background-color: rgb(0, 0, 0);
      opacity: 0;
      transition: opacity 600ms cubic-bezier(0.39, 0.575, 0.565, 1) 0ms;
    }
    &-content {
      @include roboto-light;
      position: absolute;
      visibility: hidden;
      background-color: $white;
      color: $black;
      width: 100%;
      height: 300px;
      bottom: 0px;
      transform: translate3d(0px, 300px, 0px);
      transition: -webkit-transform 500ms cubic-bezier(0.215, 0.61, 0.355, 1) 0ms;

      
    }
    &.opened {
      visibility: visible;
      .contact-overlay {
        opacity: 0.85;
      }
      .contact-content {
        visibility: visible;
        transform: translate3d(0px, 0px, 0px);
      }
    }
  }
</style>
