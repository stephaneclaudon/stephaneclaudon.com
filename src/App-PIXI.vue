<template>
  <div id="app" class="app">
    <script id="fragShader" type="shader-code">
      precision mediump float;

varying vec2 vTextureCoord;

uniform vec2 size;
uniform sampler2D uSampler;

uniform vec4 filterArea;

vec2 mapCoord( vec2 coord )
{
    coord *= filterArea.xy;
    coord += filterArea.zw;

    return coord;
}

vec2 unmapCoord( vec2 coord )
{
    coord -= filterArea.zw;
    coord /= filterArea.xy;

    return coord;
}

vec2 pixelate(vec2 coord, vec2 size)
{
	return floor( coord / size ) * size;
}

void main(void)
{
    vec2 coord = mapCoord(vTextureCoord);

    coord = pixelate(coord, size);

    coord = unmapCoord(coord);

    gl_FragColor = texture2D(uSampler, coord);
}
</script>
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
    console.log("yoyoyoyoyo");

    this.pixiApp = new PIXI.Application(window.innerWidth, window.innerHeight);
    document.getElementById("app")!.appendChild(this.pixiApp.view);

    this.sprite = PIXI.Sprite.fromImage(
      "https://raw.githubusercontent.com/stephaneclaudon/stephaneclaudon.com/master/src/assets/img/awpc%403x.jpg"
    );
    this.sprite.anchor.set(0.5);
    this.sprite.x = this.pixiApp.screen.width / 2;
    this.sprite.y = this.pixiApp.screen.height / 2;

    this.pixiApp.stage.addChild(this.sprite);
    this.initFilter();

    this.pixiApp.ticker.add(delta => {
      this.smokeShader.size += 0.01;
    });
  }

  initFilter(): void {
    var width = window.innerWidth;
    var height = window.innerHeight;
    var uniforms: any = {};
    uniforms.size = { type: "v2", value: { x: 1, y: 1 } };

    var shaderCode = document.getElementById("fragShader")!.innerHTML;
    this.smokeShader = new PixelSortingFilter(50);
    this.pixiApp.stage.filters = [this.smokeShader];
    console.log(this.smokeShader.uniforms);

  }
}
</script>

<style lang="scss">
@import "./style/main.scss";
</style>
