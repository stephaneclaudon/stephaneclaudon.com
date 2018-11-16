import { Getter, GetterTree } from 'vuex'
import { State } from './state'

// returns the complete state as-is
export function all (state: State): State {
    return state
}

// return all projects
export function projects (state: State): Array<Object> {
    return state.projects
}

// return slider current project id
export function currentSliderProjectId (state: State): number {
    return state.currentSliderProjectId
}

// return slider goto project id
export function sliderGotoProjectId (state: State): number {
    return state.sliderGotoProjectId
}

// return if slider is moving
export function sliderIsMoving (state: State): boolean {
    return state.sliderIsMoving
}

// export everything compliant to the vuex specification for getters
export default <GetterTree<State, any>> {
    all, projects
}