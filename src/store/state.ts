export class State {
    lang: string = ''
    projects: Array<any> = []
    currentProject: any = {}
    currentSliderProjectId: number = 0
    sliderGotoProjectId: number = 0
    sliderIsMoving: boolean = false
}