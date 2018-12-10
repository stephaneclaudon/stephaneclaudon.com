<template>
    <div class="audi-quattro2-ski-the-world">

      <div v-if="lang == 'fr'">Primé quatre fois au <a href="https://www.canneslions.com/" target="_blank">Festival international de la créativité de Cannes</a></div>
      <div v-else>Four times awarded at <a href="https://www.canneslions.com/" target="_blank">Cannes Lions International Festival of Creativity</a></div>

      <div class="logos">
        <img :src="getLionImagePath('gold')" alt="Cannes Lions 2018 International festival of creativity, Gold Award">
        <img :src="getLionImagePath('silver')" alt="Cannes Lions 2018 International festival of creativity, Silver Award">
      </div>

      <div class="lions">
        <div class="lion">
          <span class="lion-label" v-if="lang == 'fr'">Lion d'Or : </span>
          <span class="lion-label" v-else>Gold Lion : </span>
          <span class="lion-value">Content Creation</span>
        </div>
        <div class="lion">
          <span class="lion-label" v-if="lang == 'fr'">Lion d'Or : </span>
          <span class="lion-label" v-else>Gold Lion : </span>
          <span class="lion-value">Social Video</span>
        </div>
        <div class="lion">
          <span class="lion-label" v-if="lang == 'fr'">Lion d'Argent : </span>
          <span class="lion-label" v-else>Silver Lion : </span>
          <span class="lion-value">Sectors > Automotive</span>
        </div>
        <div class="lion">
          <span class="lion-label" v-if="lang == 'fr'">Lion d'Argent : </span>
          <span class="lion-label" v-else>Silver Lion : </span>
          <span class="lion-value">Online > Non-fiction</span>
        </div>
      </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { State } from "vuex-class";

@Component({
  components: {
  }
})
export default class audiQuattro2SkiTheWorld extends Vue {

  @State("lang") lang: string;
  
  getLionImagePath(color: string): string {
    return process.mediaPath + "img/lions/" + color + ".png";
  }
}
</script>

<style lang="scss" scoped>
@import "../../style/mixins.scss";
@import "../../style/variables.scss";
.audi-quattro2-ski-the-world {
  font-size: 1.2em;
  line-height: 1.2em;
  text-align: left;

  .logos {
    padding: 2em 3em;
    display: flex;
    justify-content: space-between;
    align-items: center;

    img {
      width: 20vw;
    }
  }

  .lions {
    .lion {
      &-label {
        color: $grey;
      }
      &-value {
        color: $white;
      }
    }
  }

  /* Large and up */
  @media screen and (min-width: 64em) {
    padding: 4em 0 0 0;
    text-align: center;
    .logos {
      padding: 2em 10vw;
      img {
        width: 5vw;
      }
    }
  }
}
</style>