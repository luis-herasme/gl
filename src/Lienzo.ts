import { getContext } from './canvas';
import { Primitives } from './Primitives';
import { Program } from './Program';

export class Lienzo {
    private gl: WebGL2RenderingContext;
    public primitives: Primitives;

    constructor() {
        const gl = getContext();
        this.gl = gl;
        this.primitives = new Primitives(this.gl);
    }

    createProgram(vertexShaderSource: string, fragmentShaderSource: string) {
        return new Program(this.gl, vertexShaderSource, fragmentShaderSource);
    }

    clear() {
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clearColor(0, 0, 0, 0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    }
}
