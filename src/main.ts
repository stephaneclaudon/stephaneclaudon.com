import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'
import { State } from './store/state'
import getters from './store/getters'
import mutations from './store/mutations'


Vue.use(Vuex)

new Vue({
  el: document.querySelector('#app') as Element,
  components: {App},
  store: new Vuex.Store({ 
    state: new State(),
    getters,
    mutations
  }),
  render (h) {
    return h('App')
  }
})
