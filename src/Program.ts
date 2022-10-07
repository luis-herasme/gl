import { getUniforms, UniformData, UniformDefinitions, UniformValue } from './uniforms';
import { generateProgram } from './utils';

export class Program {
    private program: WebGLProgram;
    private uniforms: UniformDefinitions;
    private gl: WebGL2RenderingContext;

    constructor(
        gl: WebGL2RenderingContext,
        vertexShaderSource: string,
        fragmentShaderSource: string,
        uniformData: UniformData
    ) {
        this.gl = gl;
        this.program = generateProgram(gl, vertexShaderSource, fragmentShaderSource);
        this.uniforms = getUniforms(gl, uniformData, this.program);
    }

    getProgram() {
        return this.program;
    }

    setUniform(uniformName: string, value: UniformValue) {
        const uniform = this.uniforms[uniformName];

        if (!uniform) {
            throw Error('Invalid uniform name');
        }

        uniform.data = value;
    }

    use() {
        this.gl.useProgram(this.program);
        for (const uniformName of Object.keys(this.uniforms)) {
            const uniform = this.uniforms[uniformName];
            this.gl[uniform.type](uniform.location, uniform.data);
        }
    }
}
