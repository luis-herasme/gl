import { Mesh } from './Mesh';
import { createBuffer } from './utils';

export class Primitives {
    public TRIANGLE: Mesh;

    constructor(gl: WebGL2RenderingContext) {
        this.TRIANGLE = new Mesh(gl, createBuffer(gl, [-50, 50, 0, 0, 50, 50]));
    }
}
