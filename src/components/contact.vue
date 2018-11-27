<template>
  <div class="contact-wrapper">
    <div class="toggle noselect" v-on:click="open()">
      <div class="toggle-content">Contact</div>
    </div>
      
    <div class="contact" v-bind:class="{ opened: opened, hidden: hidden }">
      <div class="contact-overlay" v-on:click="close()"></div>
      <div ref="contact" class="contact-content grid-x align-center-middle">
        <div class="contact-content__profile small-10 ">
          <div class="grid-x">
            <div class="cell small-3 medium-12">
              <img class="contact-content__profile--picture" :src="imagePath" alt="Stéphane Claudon" />
            </div>
            <div class="cell small-8 small-offset-1 medium-12 medium-offset-0">
              <div class="grid-x align-center-middle contact-content__profile--name-position-container">
                <div class="contact-content__profile--name cell small-12">
                  Stéphane Claudon
                </div>
                <div class="contact-content__profile--position cell small-12">
                  VFX - Compositing - Motion Design
                </div>
              </div>
            </div>
          </div>
          
        </div>

        <p class="contact-content__profile--resume cell small-10" v-html="jsonData['resume' + lang]"></p>

        <div class="cell small-10">
          <ul class="contact-content__social grid-x align-center">
            <li class="cell small-2">
              <a href="">
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                  <path d="M19 6h5v-6h-5c-3.86 0-7 3.14-7 7v3h-4v6h4v16h6v-16h5l1-6h-6v-3c0-0.542 0.458-1 1-1z"></path>
                </svg>
              </a>
            </li>
            <li class="cell small-2">
              <a href="">
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                  <path d="M31.988 8.563c-0.144 3.113-2.319 7.381-6.525 12.794-4.35 5.65-8.031 8.481-11.044 8.481-1.863 0-3.444-1.719-4.731-5.163-0.863-3.156-1.719-6.313-2.581-9.469-0.956-3.444-1.981-5.162-3.081-5.162-0.237 0-1.075 0.506-2.513 1.506l-1.506-1.938c1.581-1.387 3.138-2.775 4.669-4.162 2.106-1.819 3.688-2.775 4.744-2.875 2.487-0.237 4.025 1.463 4.6 5.106 0.619 3.931 1.050 6.375 1.294 7.331 0.719 3.263 1.506 4.894 2.369 4.894 0.669 0 1.675-1.056 3.019-3.175 1.337-2.113 2.056-3.725 2.156-4.831 0.194-1.825-0.525-2.744-2.156-2.744-0.769 0-1.556 0.175-2.369 0.525 1.575-5.15 4.575-7.65 9.012-7.506 3.281 0.087 4.831 2.219 4.644 6.388z"></path>
                </svg>
              </a>
            </li>
            <li class="cell small-2">
              <a href="">
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                  <path d="M16 2.881c4.275 0 4.781 0.019 6.462 0.094 1.563 0.069 2.406 0.331 2.969 0.55 0.744 0.288 1.281 0.638 1.837 1.194 0.563 0.563 0.906 1.094 1.2 1.838 0.219 0.563 0.481 1.412 0.55 2.969 0.075 1.688 0.094 2.194 0.094 6.463s-0.019 4.781-0.094 6.463c-0.069 1.563-0.331 2.406-0.55 2.969-0.288 0.744-0.637 1.281-1.194 1.837-0.563 0.563-1.094 0.906-1.837 1.2-0.563 0.219-1.413 0.481-2.969 0.55-1.688 0.075-2.194 0.094-6.463 0.094s-4.781-0.019-6.463-0.094c-1.563-0.069-2.406-0.331-2.969-0.55-0.744-0.288-1.281-0.637-1.838-1.194-0.563-0.563-0.906-1.094-1.2-1.837-0.219-0.563-0.481-1.413-0.55-2.969-0.075-1.688-0.094-2.194-0.094-6.463s0.019-4.781 0.094-6.463c0.069-1.563 0.331-2.406 0.55-2.969 0.288-0.744 0.638-1.281 1.194-1.838 0.563-0.563 1.094-0.906 1.838-1.2 0.563-0.219 1.412-0.481 2.969-0.55 1.681-0.075 2.188-0.094 6.463-0.094zM16 0c-4.344 0-4.887 0.019-6.594 0.094-1.7 0.075-2.869 0.35-3.881 0.744-1.056 0.412-1.95 0.956-2.837 1.85-0.894 0.888-1.438 1.781-1.85 2.831-0.394 1.019-0.669 2.181-0.744 3.881-0.075 1.713-0.094 2.256-0.094 6.6s0.019 4.887 0.094 6.594c0.075 1.7 0.35 2.869 0.744 3.881 0.413 1.056 0.956 1.95 1.85 2.837 0.887 0.887 1.781 1.438 2.831 1.844 1.019 0.394 2.181 0.669 3.881 0.744 1.706 0.075 2.25 0.094 6.594 0.094s4.888-0.019 6.594-0.094c1.7-0.075 2.869-0.35 3.881-0.744 1.050-0.406 1.944-0.956 2.831-1.844s1.438-1.781 1.844-2.831c0.394-1.019 0.669-2.181 0.744-3.881 0.075-1.706 0.094-2.25 0.094-6.594s-0.019-4.887-0.094-6.594c-0.075-1.7-0.35-2.869-0.744-3.881-0.394-1.063-0.938-1.956-1.831-2.844-0.887-0.887-1.781-1.438-2.831-1.844-1.019-0.394-2.181-0.669-3.881-0.744-1.712-0.081-2.256-0.1-6.6-0.1v0zM16 7.781c-4.537 0-8.219 3.681-8.219 8.219s3.681 8.219 8.219 8.219 8.219-3.681 8.219-8.219c0-4.537-3.681-8.219-8.219-8.219zM16 21.331c-2.944 0-5.331-2.387-5.331-5.331s2.387-5.331 5.331-5.331c2.944 0 5.331 2.387 5.331 5.331s-2.387 5.331-5.331 5.331zM26.462 7.456c0 1.060-0.859 1.919-1.919 1.919s-1.919-0.859-1.919-1.919c0-1.060 0.859-1.919 1.919-1.919s1.919 0.859 1.919 1.919z"></path>
                </svg>
              </a>
            </li>
          </ul>

          <div class="contact-content__phone"><a href="tel:+336000000">+336000000</a></div>
          <div class="contact-content__mail"><a href="mailto:hello@toto.com">hello@toto.com</a></div>
        </div>

        <div class="contact-content__back-button" v-on:click="close()">
          <close-button></close-button>
        </div>

      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { State } from "vuex-class";
import { Vue, Component, Prop, Emit, Watch } from "vue-property-decorator";
import CloseButton from "../components/closeButton.vue";
import jsonData from "../assets/data/data.json";

//@ts-ignore
import * as BodyScrollLock from 'body-scroll-lock';

@Component({
  components: {
    CloseButton
  }
})
export default class ContactBox extends Vue {
  opened: boolean = false;
  hidden: boolean = true;
  jsonData: any = jsonData;

  private imagePath: string = process.mediaPath + "img/me.jpg";

  @State("lang") lang: string;

  @Emit()
  open(): void {
    this.$router.push("/contact");
  }

  @Emit()
  close(): void {
    window.history.length > 1
      ? this.$router.go(-1)
      : this.$router.push("/home");
  }

  @Watch("$route")
  onRouteChanged(to: any, from: any): void {
    if (
      from.name != to.name &&
      (from.name === "contact" || to.name === "contact")
    ) {
      this.toggle();
    }
  }

  created(): void {
    if (this.$router.currentRoute.name === "contact") {
      this.toggle();
    }
  }

  toggle() {
    this.opened = !this.opened;
    if (!this.opened) {
      setTimeout(() => {
        this.hidden = true;
      }, 500);

      BodyScrollLock.enableBodyScroll(this.$refs.contact);
    } else {
      this.hidden = false;
      BodyScrollLock.disableBodyScroll(this.$refs.contact);
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../style/fonts.scss";
@import "../style/mixins.scss";
@import "../style/variables.scss";

.toggle {
  position: fixed;
  left: 8.3333%;
  bottom: 5%;
  width: auto;
  z-index: 999;
  display: inline-block;
  height: 50px;
  background-size: 73px 16px;
  font-size: 0.8em;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  cursor: pointer;
  @include transform-origin(0% 0% 0px);
  @include transform(rotate(-90deg) translateX(-50px) translateY(-50%));
  @include transition(color 0.2s);
  @include opacity(0);
  @include roboto-black;
  @keyframes contactToggle {
    from {
      @include opacity(0);
    }
    to {
      @include opacity(1);
    }
  }
  @include animation(0.25s, 1s, contactToggle);
  animation-timing-function: ease-out;

  &:hover {
    color: $light-grey;

    &-content {
      &::after {
        border-color: $light-grey;
      }
    }
  }

  &-content {
    @include transform(translateY(50%));
    &::after {
      content: "";
      display: block;
      width: 100%;
      border-bottom: solid 1px $white;
      margin-top: 5px;
      @include transition(border-color 0.2s);
    }
  }
}
.contact-wrapper {
  position: fixed;
  bottom: 5%;
  width: auto;
  z-index: 999;

  /* Large and up */
  @media screen and (min-width: 64em) {
    margin-left: 0;
    .toggle {
      left: 50px;
      bottom: 50px;
    }
    .contact-content {
      font-size: 1.2em;
      height: auto;
      min-height: auto;
      position: absolute;
      padding: 2em 0;
    }
  }
}

.contact {
  width: 100%;
  height: 100%;
  z-index: 1000;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;

  &-overlay {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgb(0, 0, 0);
    opacity: 0;
    @include transition(opacity 500ms cubic-bezier(0.39, 0.575, 0.565, 1) 0ms);
  }
  &-content {
    @include roboto-light;
    position: relative;
    background-color: $black;
    align-content: space-around;
    color: $white;
    width: 100%;
    min-height: 100%;
    bottom: 0px;
    @include transform(translate3d(0px, 100vh, 0px));
    @include transition(transform 500ms cubic-bezier(0.215, 0.61, 0.355, 1) 0ms);
    text-align: center;
    
    &__profile {
      &--picture {
        border-radius: 100%;
        width: 100%;
        max-width: 160px;
      }

      &--name-position-container {
        height: 100%;
      }

      &--name {
        @include roboto-black;
        font-size: 1.2em;
        margin: 0 0 1em 0;
        text-align: left;
      }

      &--position {
        text-transform: uppercase;
        text-align: left;
      }

      &--resume {
        white-space: pre-line;
        line-height: 1.2em;
        font-size: 1.1em;
        @include opacity(0.5)
      }
    }
    
    &__social {
      margin-bottom: 2em;
      li {
        display: inline;
        a {
          display: block;
          width: 100%;
          height: 100%;
          svg {
            width: 1.5em;
            height: 1.5em;
            path {
              fill: $white;
            }
          }
        }
      }
    }
    &__phone,
    &__mail {
      line-height: 2em;
    }

    &__back-button {
      position: absolute;
      top: 2em;
      right: 2em;
      z-index: 4;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 50px;
      width: 50px;
      transform: translate(50%, -50%);
      margin-top: 6px;
      margin-left: -6px;
    }

    /* Large and up */
    @media screen and (min-width: 64em) {
      &__profile {
        &--picture {
          margin: 2em 0 0 0;
        }
        &--name {
          margin: 2em 0 1em 0;
        }
        &--position {
          margin: 0 0 2em 0;
          text-align: center;
        }
        &--resume {
          margin: 4em 0;
        }
      }
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
