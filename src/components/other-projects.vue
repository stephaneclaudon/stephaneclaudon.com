<template>
  <div>
    <div class="other-title">plus</div>
    <div class="other-item" v-for="project in projects" :key="project.id">
        <router-link class="other-item-link" :to="{ name: 'project', params: { id: project.id }}">
          <image-src class="other-item-link-bg" :name="project.id" :title="project.title"></image-src>
        </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { State } from "vuex-class";
import { Vue, Component, Prop, Emit } from "vue-property-decorator";
import ImageSrc from "./image.vue";

@Component({
  components: { ImageSrc }
})
export default class OtherProjects extends Vue {
  @State("projects") projects: Array<Object>;
}
</script>

<style lang="scss" scoped>
@import "../style/variables.scss";

.other-title {
  color: $grey;
  text-align: center;
  text-transform: uppercase;
  margin: 2em 0;
}
</style>
