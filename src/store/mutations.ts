import * as MutationTypes from './mutation-types'
import { MutationTree } from 'vuex'

const mutations: MutationTree<any> = {
  [MutationTypes.LOAD_PROJECTS](state, projects:Array<Object>): void {
    state.projects = projects;
  }
}

export default mutations