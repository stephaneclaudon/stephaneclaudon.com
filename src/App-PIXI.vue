<template>
  <div id="app" class="app">
    
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import * as PIXI from "pixi.js";
import PixelSortingFilter from './shaders/pixelsorting/PixelSortingFilter';

@Component({
  components: {}
})
export default class AppPIXI extends Vue {
  pixiApp: PIXI.Application;
  sprite: PIXI.Sprite;
  smokeShader: PixelSortingFilter;
  count: number = 0;
  mounted() {
    this.initPIXI();
  }

  initPIXI() {

    this.pixiApp = new PIXI.Application(1242, 699);
    document.getElementById("app")!.appendChild(this.pixiApp.view);

    this.sprite = PIXI.Sprite.fromImage(
      //"https://raw.githubusercontent.com/stephaneclaudon/stephaneclaudon.com/master/src/assets/img/awpc%403x.jpg"
      //"https://raw.githubusercontent.com/stephaneclaudon/stephaneclaudon.com/master/src/assets/img/nautilus%403x.jpg"
      "https://raw.githubusercontent.com/stephaneclaudon/stephaneclaudon.com/master/src/assets/img/quattro2%403x.jpg"
      //"/dist/assets/img/pixel.jpg"
    );
    this.sprite.anchor.set(0.5);
    this.sprite.x = this.pixiApp.screen.width / 2;
    this.sprite.y = this.pixiApp.screen.height / 2;
    this.sprite.width = this.pixiApp.screen.width;
    this.sprite.height = this.pixiApp.screen.height;

    this.pixiApp.stage.addChild(this.sprite);
    this.initFilter();

    this.pixiApp.ticker.add(delta => {
      //this.smokeShader.size += 0.1;
      this.smokeShader.size = this.pixiApp.renderer.plugins.interaction.mouse.global.x / this.pixiApp.screen.width;
      
    });
  }

  initFilter(): void {
    var width = window.innerWidth;
    var height = window.innerHeight;
    var uniforms: any = {};
    uniforms.size = { type: "v2", value: { x: 1, y: 1 } };

    this.smokeShader = new PixelSortingFilter(0);
    this.smokeShader.uniforms.iResolution = [this.pixiApp.screen.width, this.pixiApp.screen.height];
    this.pixiApp.stage.filters = [this.smokeShader];
    console.log(this.pixiApp.renderer);

  }
}
</script>

<style lang="scss">
@import "./style/main.scss";
</style>
