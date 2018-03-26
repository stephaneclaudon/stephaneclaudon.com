import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'
import { State } from './store/state'
import getters from './store/getters'
import mutations from './store/mutations'
//@ts-ignore
import Stats from './lib/stats.min.js'


Vue.use(Vuex)

let vueApp: Vue = new Vue({
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

let stats: Stats = new Stats();
stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild( stats.dom );
function animate() {
  stats.begin();
	stats.end();
	requestAnimationFrame( animate );
}
requestAnimationFrame( animate );