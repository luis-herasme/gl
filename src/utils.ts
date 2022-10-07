import { GL_FRAGMENT_SHADER, GL_VERTEX_SHADER } from './webgl-constants';

type ShaderType = typeof GL_FRAGMENT_SHADER | typeof GL_VERTEX_SHADER;

export function generateProgram(
    gl: WebGL2RenderingContext,
    vertexShaderSource: string,
    fragmentShaderSource: string
): WebGLProgram {
    const vertexShader = createShader(gl, GL_VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, GL_FRAGMENT_SHADER, fragmentShaderSource);

    if (!vertexShader || !fragmentShader) {
        throw new Error('Invalid vertex of fragment shader');
    }

    const program = createProgram(gl, vertexShader, fragmentShader);
    if (!program) {
        throw new Error('Invalid program');
    }

    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);

    return program;
}

function createShader(gl: WebGL2RenderingContext, type: ShaderType, soruce: string): WebGLShader | undefined {
    const shader = gl.createShader(type);
    if (!shader) {
        throw new Error('Error generating shader');
    }

    gl.shaderSource(shader, soruce);
    gl.compileShader(shader);

    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
        return shader;
    }

    console.error('Error creating shader');
    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}

function createProgram(
    gl: WebGL2RenderingContext,
    vertexShader: WebGLShader,
    fragmentShader: WebGLShader
): WebGLProgram | undefined {
    const program = gl.createProgram();
    if (!program) {
        throw new Error('Error generating program');
    }

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    const success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
        return program;
    }

    console.error('Error creating program');
    console.error(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
}

export function createBuffer(gl: WebGL2RenderingContext, data: number[]): WebGLBuffer {
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    if (!positionBuffer) throw Error('Error creating buffer');
    return positionBuffer;
}
