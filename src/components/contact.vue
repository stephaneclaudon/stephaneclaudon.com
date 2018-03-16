<template>
  <div>
    <div class="toggle" v-on:click="toggle()">Contact</div>
    <div class="contact" v-bind:class="{ opened: opened, hidden: hidden }">
      <div class="contact-overlay" v-on:click="toggle()"></div>
      <div class="contact-content grid-x align-center-middle">
        <div class="cell">
          <ul class="contact-content__social grid-x align-center">
              <li class="cell small-2">
                <a href=""><i class="icon icon-facebook"></i></a>
              </li>
              <li class="cell small-2">
                <a href=""><i class="icon icon-vimeo"></i></a>
              </li>
              <li class="cell small-2">
                <a href=""><i class="icon icon-instagram"></i></a>
              </li>
          </ul>
          <div class="contact-content__phone"><a href="tel:+336000000">+336000000</a></div>
          <div class="contact-content__mail"><a href="mailto:hello@toto.com">hello@toto.com</a></div>
        </div>
      </div>
    </div>
    
  </div>
</template>

<script lang="ts">
  import {Vue, Component, Prop, Emit} from 'vue-property-decorator'
  
  @Component
  export default class ContactBox extends Vue {
    opened: boolean = true
    hidden: boolean = false
    
    @Emit()
    toggle(){
      this.opened = !this.opened
      if(!this.opened) {
        setTimeout(() => {
          this.hidden = true
        }, 500)
      } else {
        this.hidden = false
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../style/main.scss';

  .toggle {
    position: fixed;
    bottom: 100px;
    left: 150px;
    height: 50px;
    background-size: 73px 16px;
    opacity: 1;
    @include transform(rotate(-90deg));
    @include transform-origin(0% 100% 0px);
    @include transition(opacity 2000ms cubic-bezier(0.445, 0.05, 0.55, 0.95) 500ms);

    &::after {
      content: "";
      display: block;
      width: 100%;
      border-bottom: solid 2px $white;
      margin-top: 5px;
    }
  }

  .contact {
    width: 100%;
    height: 100%;
    z-index: 100;
    position: fixed;
    top: 0;
    left: 0;

    &-overlay {
      position: absolute;
      width: 100%;
      height: 100%;
      background-color: rgb(0, 0, 0);
      opacity: 0;
      @include transition(opacity 500ms cubic-bezier(0.39, 0.575, 0.565, 1) 0ms)
    }
    &-content {
      @include roboto-light;
      position: absolute;
      background-color: $black;
      color: $white;
      width: 100%;
      height: 33%;
      bottom: 0px;
      @include transform(translate3d(0px, 100%, 0px));
      @include transition(transform 500ms cubic-bezier(0.215, 0.61, 0.355, 1) 0ms);
      text-align: center;

      &__social {
        margin-bottom: 2em;
        li {
          display: inline;
          a {
            display: block;
            width: 100%;
            height: 100%;
            .icon {
              line-height: 1.5em;
              font-size: 1.5em;
            }
          }
        }
      }
      &__phone, &__mail {
       line-height: 2em; 
      }
    }
    &.opened {
      visibility: visible;
      .contact-overlay {
        opacity: 0.85;
      }
      .contact-content {
        transform: translate3d(0px, 0px, 0px);
      }
    }
    &.hidden {
      visibility: hidden;
    }
  }
</style>
