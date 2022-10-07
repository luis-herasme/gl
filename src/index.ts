import { GameObject } from './GameObject';
import { Lienzo } from './Lienzo';
import { Material } from './Material';
import { Scene } from './Scene';

const vertexShaderSource = `#version 300 es

layout(location = 0) in vec2 a_position;
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
    const lienzo = new Lienzo();

    const program = lienzo.createProgram(vertexShaderSource, fragmentShaderSource);
    const scene = new Scene();
    const material = new Material(program);
    const triangle = new GameObject(material, lienzo.primitives.TRIANGLE);

    scene.addGameObject(triangle);

    triangle.x = 200;

    let t = 0.01;
    setInterval(() => {
        t = t + 0.01;
        triangle.y = 200 + 100 * Math.sin(t);
        lienzo.clear();
        scene.draw();
    }, 5);
};
