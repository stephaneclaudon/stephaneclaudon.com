import * as MutationTypes from './mutation-types'
import { MutationTree } from 'vuex'

const mutations: MutationTree<any> = {
  [MutationTypes.LOAD_PROJECTS](state, projects:Array<Object>): void {
    state.projects = projects;
  },
  [MutationTypes.SET_CURRENT_PROJECT](state, project:Object): void {
    state.currentProject = project;
  }
}

export default mutations