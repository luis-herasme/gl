import { getUniformDefinition, UniformDefinitions, UniformValue } from './uniforms';
import { generateProgram } from './utils';

export class Program {
    private program: WebGLProgram;
    private uniforms: UniformDefinitions = {};
    private gl: WebGL2RenderingContext;

    constructor(
        gl: WebGL2RenderingContext,
        vertexShaderSource: string,
        fragmentShaderSource: string
    ) {
        this.gl = gl;
        this.program = generateProgram(gl, vertexShaderSource, fragmentShaderSource);
    }

    getProgram() {
        return this.program;
    }

    updateUniformData(uniformName: string, value: UniformValue) {
        const uniform = this.uniforms[uniformName];
        if (!uniform) {
            this.uniforms[uniformName] = getUniformDefinition(
                this.gl,
                uniformName,
                value,
                this.program
            );
        } else {
            uniform.data = value;
        }
    }

    use() {
        this.gl.useProgram(this.program);

        this.updateUniformData(
            'u_resolution',
            new Float32Array([this.gl.canvas.width, this.gl.canvas.height])
        );
    }

    setUniforms() {
        for (const uniformName of Object.keys(this.uniforms)) {
            const uniform = this.uniforms[uniformName];
            this.gl[uniform.type](uniform.location, uniform.data);
        }
    }
}
