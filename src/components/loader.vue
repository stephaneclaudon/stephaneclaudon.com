
<template>
    <svg class = 'nig'>
        <defs>
            <filter id="poo">
                <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="4" />
                <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -8" result="goo" />
                <feBlend in2="goo" in="SourceGraphic" result="mix" />
            </filter>
        </defs>

        <mask id="mask">
            <g id = "g" class="balls" style="-webkit-filter: url('#poo'); filter: url('#poo'); fill:white;">
            <circle cx="25" cy="25" r="6" id = 'b1'></circle>
            <circle cx="25" cy="25" r="6" id = 'b2'></circle>
            </g>
        </mask>

        <rect x="0" y="0"  mask="url(#mask)" fill='white' width="50" height="50" />

        <animateTransform xlink:href="#g" attributeName="transform" attributeType="XML" type="rotate"
                from="0 25 25"
                to = "360 25 25"
                dur=".5s" repeatCount="indefinite" />
        <animate id = 'an1' xlink:href="#b1" attributeName="cx" calcMode="spline" keyTimes="0; 0.5; 1"
                values="25; 18; 25"
                keySplines=".6 .01 .36 .99; .6 .01 .36 .99;"
                dur=".5s" repeatCount="indefinite" />
        <animate id = 'an2' xlink:href="#b2" attributeName="cx"
                values="25; 32; 25"
                calcMode="spline"
            keySplines=".6 .01 .36 .99; .6 .01 .36 .99;"
                keyTimes="0; 0.5; 1" to="60" dur=".5s" repeatCount="indefinite" />
        <animate xlink:href="#b1" attributeName="r"
                values="6.4; 5; 6.4"
                calcMode="spline"
            keySplines=".6 .01 .36 .99; .6 .01 .36 .99;"
                keyTimes="0; 0.5; 1" to="60" dur=".5s" repeatCount="indefinite" />
        <animate xlink:href="#b2" attributeName="r"
                values="6.4; 5; 6.4"
                calcMode="spline"
            keySplines=".6 .01 .36 .99; .6 .01 .36 .99;"
                keyTimes="0; 0.5; 1" to="60" dur=".5s" repeatCount="indefinite" />
    </svg>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class Loader extends Vue {}
</script>

<style lang="scss" scoped>
.nig {
    height: 50px;
    width: 50px;
}
</style>