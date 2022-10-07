import { getContext } from './canvas';
import { getUniforms, UniformData, UniformDefinition } from './uniforms';
import { createBuffer, generateProgram } from './utils';

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
    const program = generateProgram(gl, vertexShaderSource, fragmentShaderSource);

    const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
    const translation = new Float32Array([200, 0]);

    const buffers = [
        createBuffer(gl, [50, 150, 100, 100, 150, 150]),
        createBuffer(gl, [-50, 50, 0, 0, 50, 50])
    ];

    const uniformData: UniformData = {
        u_translation: translation,
        u_resolution: new Float32Array([gl.canvas.width, gl.canvas.height])
    };

    const uniforms = getUniforms(gl, uniformData, program);

    const vertexArrayObject = gl.createVertexArray();
    gl.bindVertexArray(vertexArrayObject);
    gl.enableVertexAttribArray(positionAttributeLocation);

    if (!vertexArrayObject) throw Error('Error creating vao');

    let t = 0.01;
    setInterval(() => {
        t = t + 0.01;
        translation[1] = 200 + 100 * Math.sin(t);
        // uniformData['u_resolution'].data = new Float32Array([gl.canvas.width, gl.canvas.height]);
        draw(gl, program, uniforms, buffers, [positionAttributeLocation]);
    }, 5);
};

function draw(
    gl: WebGL2RenderingContext,
    program: WebGLProgram,
    uniforms: UniformDefinition[],
    buffers: WebGLBuffer[],
    attibutes: number[]
) {
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);

    for (const uniform of uniforms) {
        gl[uniform.type](uniform.location, uniform.data);
    }

    for (const buffer of buffers) {
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.vertexAttribPointer(attibutes[0], 2, gl.FLOAT, false, 0, 0);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
}
