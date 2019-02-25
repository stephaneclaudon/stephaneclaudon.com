import * as MutationTypes from './mutation-types'
import { MutationTree } from 'vuex'

const mutations: MutationTree<any> = {
  [MutationTypes.LOAD_PROJECTS](state, projects:Array<Object>): void {
    state.projects = projects;
  },
  [MutationTypes.SET_CURRENT_PROJECT](state, project:Object): void {
    state.currentProject = project;
  },
  [MutationTypes.SET_CURRENT_PROJECT_DIMENSIONS](state, dimensions:Object): void {
    state.currentProjectDimensions = dimensions;
  },
  [MutationTypes.SLIDER_SET_CURRENT_PROJECT_ID](state, projectId: number): void {
    state.currentSliderProjectId = projectId;
  },
  [MutationTypes.SLIDER_SET_GOTO_PROJECT_ID](state, projectId: number): void {
    state.sliderGotoProjectId = projectId;
  },
  [MutationTypes.SLIDER_SET_IS_MOVING](state, moving: boolean): void {
    state.sliderIsMoving = moving;
  }
}

export default mutations