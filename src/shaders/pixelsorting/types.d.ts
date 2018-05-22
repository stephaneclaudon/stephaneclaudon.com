declare module "PixelSortingFilter" {
    export class PixelSortingFilter extends PIXI.Filter<{}> {
        constructor(size?:PIXI.Point|number[]|number);
        size:PIXI.Point|number[]|number;
    }
}