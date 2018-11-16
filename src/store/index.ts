import Vue from 'vue'
import Vuex from 'vuex'
import { State } from './state'
import getters from './getters'
import mutations from './mutations'

Vue.use(Vuex)

const state = new State();
const store = new Vuex.Store({
  state: state,
  getters,
  mutations
});

export default store