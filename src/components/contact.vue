<template>
  <div class="contact-wrapper">
    <div class="grid-x">
      <div class="cell small-10 small-offset-1">
        <div class="toggle noselect" v-on:click="open()">Contact</div>
      </div>
      
      <div class="contact" v-bind:class="{ opened: opened, hidden: hidden }">
        <div class="contact-overlay" v-on:click="close()"></div>
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
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit, Watch } from "vue-property-decorator";

@Component
export default class ContactBox extends Vue {
  opened: boolean = false;
  hidden: boolean = true;

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
    } else {
      this.hidden = false;
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../style/main.scss";

.toggle {
  display: inline-block;
  height: 50px;
  background-size: 73px 16px;
  font-size: 0.8em;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  @include opacity(0);
  @include roboto-black;
  @include transform(rotate(-90deg));
  @include transform-origin(35% 53% 0px);
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

  &::after {
    content: "";
    display: block;
    width: 100%;
    border-bottom: solid 1px $white;
    margin-top: 5px;
  }
}
.contact-wrapper {
  position: fixed;
  bottom: 5%;
  width: 100%;

  .cell {
    /* Large and up */
    @media screen and (min-width: 64em) {
      margin-left: 50px;
    }
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
    @include transition(opacity 500ms cubic-bezier(0.39, 0.575, 0.565, 1) 0ms);
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
    @include transition(
      transform 500ms cubic-bezier(0.215, 0.61, 0.355, 1) 0ms
    );
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
    &__phone,
    &__mail {
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
