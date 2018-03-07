<template>
  <div>
    <div class="contact-toggle" v-on:click="toggle()">Contact</div>
    <div class="contact-content" v-bind:class="{ opened: opened }">
        <ul>
            <li class="contact-content__facebook">facebook</li>
            <li class="contact-content__vimeo">vimeo</li>
            <li class="contact-content__instagram">instagram</li>
        </ul>
        <div class="contact-content__phone">+336</div>
        <div class="contact-content__mail">hello@toto.com</div>
    </div>
  </div>
</template>

<script lang="ts">
  import {Vue, Component, Prop, Emit} from 'vue-property-decorator'
  
  @Component
  export default class ContactBox extends Vue {
    opened: boolean = false
    
    @Emit()
    toggle(){ this.opened = !this.opened }
  }
</script>
