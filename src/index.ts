import { GL_FRAGMENT_SHADER, GL_KEEP, GL_VERTEX_SHADER } from './webgl-constants';

const vertexShaderSource = `#version 300 es

in vec4 a_position;

void main()
{
    gl_Position = a_position;
}
`;

const fragmentShaderSource = `#version 300 es

precision mediump float;

out vec4 fragColor;

void main()
{
    fragColor = vec4(1.0, 0.0, 0.0, 1.0);
}
`;

window.onload = () => {
    const canvas = document.getElementById('game');
    if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
        throw new Error('Game canvas not found #game');
    }

    const gl = canvas.getContext('webgl2');
    if (!gl) {
        throw new Error('WebGL context not found');
    }

    const vertexShader = createShader(gl, GL_VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, GL_FRAGMENT_SHADER, fragmentShaderSource);

    if (!vertexShader || !fragmentShader) {
        throw new Error('Invalid vertex of fragment shader');
    }

    const program = createProgram(gl, vertexShader, fragmentShader);
    if (!program) {
        throw new Error('Invalid program');
    }

    const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
    const positionBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    const positions = new Float32Array([0, 0, 0, 0.5, 0.7, 0]);

    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const vertexArrayObject = gl.createVertexArray();
    gl.bindVertexArray(vertexArrayObject);
    gl.enableVertexAttribArray(positionAttributeLocation);

    const size = 2; // components per iteration
    const type = gl.FLOAT; // type 32 bit float
    const normalize = false; // dont normalize the data
    const stride = 0; // move foward size * sizeof(type)
    const offset = 0; // start from the beginning

    gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
};

type ShaderType = typeof GL_FRAGMENT_SHADER | typeof GL_VERTEX_SHADER;

function createShader(gl: WebGL2RenderingContext, type: ShaderType, soruce: string): WebGLShader | null {
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
    return null;
}

function createProgram(gl: WebGL2RenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram | null {
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

    return null;
}
