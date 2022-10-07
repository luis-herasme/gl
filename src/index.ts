import { getContext } from './canvas';
import { Program } from './Program';
import { createBuffer } from './utils';

const vertexShaderSource = `#version 300 es

in vec2 a_position;
uniform vec2 u_resolution;
uniform vec2 u_translation;

void main()
{
    vec2 position = a_position + u_translation;

    // Convert the position from pixels -> 0.0, 1.0
    vec2 zeroToOne = position / u_resolution;

    // Convert from 0.0, 1.0 -> 0.0, 2.0
    vec2 zeroToTwo = zeroToOne * 2.0;

    // Convert from 0.0, 2.0 -> -1.0, +1.0
    vec2 clipSpace = zeroToTwo - 1.0;

    gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
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
    const gl = getContext();
    const program = new Program(gl, vertexShaderSource, fragmentShaderSource, {
        u_translation: new Float32Array([200, 0]),
        u_resolution: new Float32Array([gl.canvas.width, gl.canvas.height])
    });

    const positionAttributeLocation = gl.getAttribLocation(program.getProgram(), 'a_position');

    const buffers = [
        createBuffer(gl, [50, 150, 100, 100, 150, 150]),
        createBuffer(gl, [-50, 50, 0, 0, 50, 50])
    ];

    const vertexArrayObject = gl.createVertexArray();
    gl.bindVertexArray(vertexArrayObject);
    gl.enableVertexAttribArray(positionAttributeLocation);

    if (!vertexArrayObject) throw Error('Error creating vao');

    let t = 0.01;
    setInterval(() => {
        t = t + 0.01;
        program.setUniform('u_translation', new Float32Array([200, 200 + 100 * Math.sin(t)]));
        program.setUniform('u_resolution', new Float32Array([gl.canvas.width, gl.canvas.height]));
        draw(gl, program, buffers, [positionAttributeLocation]);
    }, 5);
};

function draw(
    gl: WebGL2RenderingContext,
    program: Program,
    buffers: WebGLBuffer[],
    attibutes: number[]
) {
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    program.use();

    for (const buffer of buffers) {
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.vertexAttribPointer(attibutes[0], 2, gl.FLOAT, false, 0, 0);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
}
