//@ts-ignore
import vertex from './pixelsorting.vert';
//@ts-ignore
import fragment from './pixelsorting.glslx';
import * as PIXI from 'pixi.js';

/**
 * This filter applies a pixelsorting effect making display objects appear 'blocky'.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/pixelsorting.png)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @param {PIXI.Point|Array<number>|number} [size=10] Either the width/height of the size of the pixels, or square size
 */
export default class PixelSortingFilter extends PIXI.Filter<any> {

    constructor(size = 10) {
        super(vertex, fragment);
        this.size = size;
    }

    /**
     * This a point that describes the size of the blocks.
     * x is the width of the block and y is the height.
     *
     * @member {PIXI.Point|Array<number>|number}
     * @default 10
     */
    get size(): number {
        return this.uniforms.size[0];
    }
    set size(value: number) {
        if (typeof value === 'number') {
            this.uniforms.size = [value, value];
        } else {
            this.uniforms.size = value;
        }
        
    }


    /**
     * This a point that describes the time in scene.
     *
     * @member {PIXI.Point|Array<number>|number}
     * @default 10
     */
    get time(): number {
        return this.uniforms.time;
    }
    set time(value: number) {
        this.uniforms.time = value;
    }
}
