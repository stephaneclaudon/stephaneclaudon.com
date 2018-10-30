<template>
  <div class="contact-wrapper small-offset-1">
    <div class="toggle noselect small-offset-1" v-on:click="open()">Contact</div>
      
    <div class="contact" v-bind:class="{ opened: opened, hidden: hidden }">
      <div class="contact-overlay" v-on:click="close()"></div>
      <div class="contact-content grid-x align-center-middle">
        <div class="cell small-10">
          <div class="contact-content__profile grid-x align-center">
            <div>
              <img class="contact-content__profile--picture" :src="imagePath" alt="Stéphane Claudon" />
              <div class="contact-content__profile--position">
                VFX - Compositing - Motion Design
              </div>
              <p class="contact-content__profile--resume">
                Je suis né en 1987 à Chamonix-Mont-Blanc.<br/>
                J'achète mon premier ordinateur en 2004 pour créer des vidéos de ski innovantes.<br/>
                <br/>
                Autodidacte en post-production depuis près de 15 ans,<br/>
                je suis également diplomé de l'école GOBELINS Annecy en tant que Concepteur Réalisateur Multimédia.<br/>
                <br/>
                Après 7 années d'experience comme développeur multimedia dans deux agences à Annecy et Genève,<br/>
                je me consacre désormais entièrement à mon activité vidéo.<br/>
                <br/>
                
                <br/>
              </p>
            </div>
          </div>

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

        <router-link class="contact-content__back-button" :to="{ name: 'home' }">
          <close-button></close-button>
        </router-link>

      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit, Watch } from "vue-property-decorator";
import CloseButton from "../components/closeButton.vue";

@Component({
  components: {
    CloseButton
  }
})
export default class ContactBox extends Vue {
  opened: boolean = false;
  hidden: boolean = true;

  private imagePath: string = process.mediaPath + "img/me.jpg";

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
@import "../style/fonts.scss";
@import "../style/mixins.scss";
@import "../style/variables.scss";

.toggle {
  display: inline-block;
  height: 50px;
  background-size: 73px 16px;
  font-size: 0.8em;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  cursor: pointer;
  @include transition(color 0.2s);
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

  &:hover {
    color: $light-grey;
    &::after {
      border-color: $light-grey;
    }
  }

  &::after {
    content: "";
    display: block;
    width: 100%;
    border-bottom: solid 1px $white;
    margin-top: 5px;
    @include transition(border-color 0.2s);
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
      margin-left: 50px;
    }
  }

  /* Medium and up */
  @media screen and (min-width: 40em) {
    .contact-content {
      font-size: 1.2em;
      height: auto;
      padding: 2em 0;
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
    height: 100%;
    bottom: 0px;
    @include transform(translate3d(0px, 100%, 0px));
    @include transition(
      transform 500ms cubic-bezier(0.215, 0.61, 0.355, 1) 0ms
    );
    text-align: center;
    
    &__profile {
      &--picture {
        border-radius: 100%;
        width: 30%;
        max-width: 160px;
        margin: 2em 0 0 0;
      }

      &--position {
        margin: 2em 0;
        text-transform: uppercase;
      }

      &--resume {
        margin: 4em 0;
        line-height: 1.2em;
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
