<template>
  <div>
    <div>
      hello
    </div>
    <div>
      steph {{ initnumero + numero }}
    </div>
  </div>
</template>

<script lang="ts">
  import {Vue, Component, Prop} from 'vue-property-decorator'
  @Component({})

  export default class App extends Vue {
    @Prop({type: Number, default: 0}) initnumero: number
    numero: number = 0

    mounted () {
      window.setInterval(() => {
        this.numero++
      }, 1000)
    }

  }
</script>
