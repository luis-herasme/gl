import { Mesh } from './Mesh';
import { createBuffer } from './utils';

export class Primitives {
    public TRIANGLE: Mesh;
    public SQUARE: Mesh;

    constructor(gl: WebGL2RenderingContext) {
        this.TRIANGLE = new Mesh(gl, createBuffer(gl, [-50, 50, 0, 0, 50, 50]));
        this.SQUARE = new Mesh(gl, createBuffer(gl, [
            0, 0,
            0, 100,
            100, 100,
            0, 0,
            100, 0,
            100, 100,
        ]));
    }
}
