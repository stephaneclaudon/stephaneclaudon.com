//@ts-ignore
import * as PIXI from "pixi.js";
import VideoSnapshooter from "./VideoSnapshooter";

export default class SliderVideoBG {
    pixiTicker: any = PIXI.ticker.shared;
    pixiApp: PIXI.Application;
    pixiRenderer: PIXI.CanvasRenderer;
    snapshot: PIXI.Sprite;

    videoElement: HTMLVideoElement;
    alive: boolean;
    inited: boolean = false;
    snapshotURLData: string;
    vertexShader: string = 'attribute vec3 position;\r\n attribute vec2 uv;\r\n varying vec2 vUv;\r\n void main() {\r\n vUv = uv;\r\n gl_Position = vec4(position, 1.0);\r\n }\r\n';
    fragmentShader: string = 'precision highp float;\r\n        \r\n          uniform float time;\r\n          uniform vec2 resolution;\r\n          uniform sampler2D texture;\r\n          \r\n          varying vec2 vUv;\r\n          \r\n          float random(vec2 c){\r\n            return fract(sin(dot(c.xy ,vec2(12.9898,78.233))) * 43758.5453);\r\n          }\r\n\r\n          \/\/\r\n          \/\/ Description : Array and textureless GLSL 2D\/3D\/4D simplex\r\n          \/\/               noise functions.\r\n          \/\/      Author : Ian McEwan, Ashima Arts.\r\n          \/\/  Maintainer : ijm\r\n          \/\/     Lastmod : 20110822 (ijm)\r\n          \/\/     License : Copyright (C) 2011 Ashima Arts. All rights reserved.\r\n          \/\/               Distributed under the MIT License. See LICENSE file.\r\n          \/\/               https:\/\/github.com\/ashima\/webgl-noise\r\n          \/\/\r\n\r\n          vec3 mod289(vec3 x) {\r\n            return x - floor(x * (1.0 \/ 289.0)) * 289.0;\r\n          }\r\n\r\n          vec4 mod289(vec4 x) {\r\n            return x - floor(x * (1.0 \/ 289.0)) * 289.0;\r\n          }\r\n\r\n          vec4 permute(vec4 x) {\r\n               return mod289(((x*34.0)+1.0)*x);\r\n          }\r\n\r\n          vec4 taylorInvSqrt(vec4 r)\r\n          {\r\n            return 1.79284291400159 - 0.85373472095314 * r;\r\n          }\r\n\r\n          float snoise3(vec3 v)\r\n            {\r\n            const vec2  C = vec2(1.0\/6.0, 1.0\/3.0) ;\r\n            const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);\r\n\r\n          \/\/ First corner\r\n            vec3 i  = floor(v + dot(v, C.yyy) );\r\n            vec3 x0 =   v - i + dot(i, C.xxx) ;\r\n\r\n          \/\/ Other corners\r\n            vec3 g = step(x0.yzx, x0.xyz);\r\n            vec3 l = 1.0 - g;\r\n            vec3 i1 = min( g.xyz, l.zxy );\r\n            vec3 i2 = max( g.xyz, l.zxy );\r\n\r\n            \/\/   x0 = x0 - 0.0 + 0.0 * C.xxx;\r\n            \/\/   x1 = x0 - i1  + 1.0 * C.xxx;\r\n            \/\/   x2 = x0 - i2  + 2.0 * C.xxx;\r\n            \/\/   x3 = x0 - 1.0 + 3.0 * C.xxx;\r\n            vec3 x1 = x0 - i1 + C.xxx;\r\n            vec3 x2 = x0 - i2 + C.yyy; \/\/ 2.0*C.x = 1\/3 = C.y\r\n            vec3 x3 = x0 - D.yyy;      \/\/ -1.0+3.0*C.x = -0.5 = -D.y\r\n\r\n          \/\/ Permutations\r\n            i = mod289(i);\r\n            vec4 p = permute( permute( permute(\r\n                       i.z + vec4(0.0, i1.z, i2.z, 1.0 ))\r\n                     + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))\r\n                     + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));\r\n\r\n          \/\/ Gradients: 7x7 points over a square, mapped onto an octahedron.\r\n          \/\/ The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)\r\n            float n_ = 0.142857142857; \/\/ 1.0\/7.0\r\n            vec3  ns = n_ * D.wyz - D.xzx;\r\n\r\n            vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  \/\/  mod(p,7*7)\r\n\r\n            vec4 x_ = floor(j * ns.z);\r\n            vec4 y_ = floor(j - 7.0 * x_ );    \/\/ mod(j,N)\r\n\r\n            vec4 x = x_ *ns.x + ns.yyyy;\r\n            vec4 y = y_ *ns.x + ns.yyyy;\r\n            vec4 h = 1.0 - abs(x) - abs(y);\r\n\r\n            vec4 b0 = vec4( x.xy, y.xy );\r\n            vec4 b1 = vec4( x.zw, y.zw );\r\n\r\n            \/\/vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;\r\n            \/\/vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;\r\n            vec4 s0 = floor(b0)*2.0 + 1.0;\r\n            vec4 s1 = floor(b1)*2.0 + 1.0;\r\n            vec4 sh = -step(h, vec4(0.0));\r\n\r\n            vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;\r\n            vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;\r\n\r\n            vec3 p0 = vec3(a0.xy,h.x);\r\n            vec3 p1 = vec3(a0.zw,h.y);\r\n            vec3 p2 = vec3(a1.xy,h.z);\r\n            vec3 p3 = vec3(a1.zw,h.w);\r\n\r\n          \/\/Normalise gradients\r\n            vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));\r\n            p0 *= norm.x;\r\n            p1 *= norm.y;\r\n            p2 *= norm.z;\r\n            p3 *= norm.w;\r\n\r\n          \/\/ Mix final noise value\r\n            vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);\r\n            m = m * m;\r\n            return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),\r\n                                          dot(p2,x2), dot(p3,x3) ) );\r\n            }\r\n                    \r\n          const float interval = 3.0;\r\n          \r\n          void main(void){\r\n            float strength = smoothstep(interval * 0.5, interval, interval - mod(time, interval));\r\n            vec2 shake = vec2(strength * 8.0 + 0.5) * vec2(\r\n              random(vec2(time)) * 2.0 - 1.0,\r\n              random(vec2(time * 2.0)) * 2.0 - 1.0\r\n            ) \/ resolution;\r\n          \r\n            float y = vUv.y * resolution.y;\r\n            float rgbWave = (\r\n                snoise3(vec3(0.0, y * 0.01, time * 400.0)) * (2.0 + strength * 32.0)\r\n                * snoise3(vec3(0.0, y * 0.02, time * 200.0)) * (1.0 + strength * 4.0)\r\n                + step(0.9995, sin(y * 0.005 + time * 1.6)) * 12.0\r\n                + step(0.9999, sin(y * 0.005 + time * 2.0)) * -18.0\r\n              ) \/ resolution.x;\r\n            float rgbDiff = (6.0 + sin(time * 500.0 + vUv.y * 40.0) * (20.0 * strength + 1.0)) \/ resolution.x;\r\n            float rgbUvX = vUv.x + rgbWave;\r\n            float r = texture2D(texture, vec2(rgbUvX + rgbDiff, vUv.y) + shake).r;\r\n            float g = texture2D(texture, vec2(rgbUvX, vUv.y) + shake).g;\r\n            float b = texture2D(texture, vec2(rgbUvX - rgbDiff, vUv.y) + shake).b;\r\n          \r\n            float whiteNoise = (random(vUv + mod(time, 10.0)) * 2.0 - 1.0) * (0.15 + strength * 0.15);\r\n          \r\n            float bnTime = floor(time * 20.0) * 200.0;\r\n            float noiseX = step((snoise3(vec3(0.0, vUv.x * 3.0, bnTime)) + 1.0) \/ 2.0, 0.12 + strength * 0.3);\r\n            float noiseY = step((snoise3(vec3(0.0, vUv.y * 3.0, bnTime)) + 1.0) \/ 2.0, 0.12 + strength * 0.3);\r\n            float bnMask = noiseX * noiseY;\r\n            float bnUvX = vUv.x + sin(bnTime) * 0.2 + rgbWave;\r\n            float bnR = texture2D(texture, vec2(bnUvX + rgbDiff, vUv.y)).r * bnMask;\r\n            float bnG = texture2D(texture, vec2(bnUvX, vUv.y)).g * bnMask;\r\n            float bnB = texture2D(texture, vec2(bnUvX - rgbDiff, vUv.y)).b * bnMask;\r\n            vec4 blockNoise = vec4(bnR, bnG, bnB, 1.0);\r\n          \r\n            float bnTime2 = floor(time * 25.0) * 300.0;\r\n            float noiseX2 = step((snoise3(vec3(0.0, vUv.x * 2.0, bnTime2)) + 1.0) \/ 2.0, 0.12 + strength * 0.5);\r\n            float noiseY2 = step((snoise3(vec3(0.0, vUv.y * 8.0, bnTime2)) + 1.0) \/ 2.0, 0.12 + strength * 0.3);\r\n            float bnMask2 = noiseX2 * noiseY2;\r\n            float bnR2 = texture2D(texture, vec2(bnUvX + rgbDiff, vUv.y)).r * bnMask2;\r\n            float bnG2 = texture2D(texture, vec2(bnUvX, vUv.y)).g * bnMask2;\r\n            float bnB2 = texture2D(texture, vec2(bnUvX - rgbDiff, vUv.y)).b * bnMask2;\r\n            vec4 blockNoise2 = vec4(bnR2, bnG2, bnB2, 1.0);\r\n          \r\n            float waveNoise = (sin(vUv.y * 1200.0) + 1.0) \/ 2.0 * (0.15 + strength * 0.2);\r\n          \r\n            gl_FragColor = vec4(r, g, b, 1.0) * (1.0 - bnMask - bnMask2) + (whiteNoise + blockNoise + blockNoise2 - waveNoise);\r\n          }\r\n        '

    constructor(videoElement: HTMLVideoElement, alive: boolean) {
        this.alive = alive;
        this.videoElement = videoElement;
        this.videoElement.addEventListener(
            "playing",
            () => this.onVideoStartPlaying(),
            false
        );
        this.pixiApp = new PIXI.Application({ 
            antialias: true,    // default: false
            transparent: false, // default: false
            resolution: 1       // default: 1
        });
        this.pixiApp.renderer.autoResize = true;
        this.pixiApp.renderer.resize(window.innerWidth, window.innerHeight);
        
        videoElement.parentElement!.appendChild(this.pixiApp.view);
    }

    onVideoStartPlaying(): void {
        if (!this.inited) {
            if (!this.alive) {
                this.videoElement.pause();
                this.freezeVideo();
            }
            this.inited = true;
        }
    }

    freezeVideo(): void {
        this.snapshotURLData = VideoSnapshooter.getInstance().takeSnapshot(this.videoElement);
        this.pixiTicker.start();
        this.videoElement.pause();
        this.snapshot = PIXI.Sprite.fromImage(this.snapshotURLData);
        this.snapshot.position.x = window.innerWidth*0.5;
        this.snapshot.position.y = window.innerHeight*0.5;
        this.snapshot.anchor.x = 0.5;
        this.snapshot.anchor.y = 0.5;
        this.pixiApp.stage.addChild(this.snapshot);

    }

    unfreezeVideo(): void {
        this.videoElement.play();
        this.pixiTicker.stop();
        this.pixiApp.stage.removeChild(this.snapshot);
    }
}