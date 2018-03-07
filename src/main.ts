import Vue from 'vue'
import App from './App.vue'

new Vue({
  el: document.querySelector('#app') as Element,
  components: {App},
  render (h) {
    return h('App', {attrs: {initnumero: '100'}})
  }
})
