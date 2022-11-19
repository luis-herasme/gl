import { GameObject } from './GameObject';
import { Lienzo } from './Lienzo';
import { Material } from './Material';
import { Scene } from './Scene';

const vertexShader = `#version 300 es

layout(location = 0) in vec2 a_position;

layout(location = 1) in vec2 aTexCoord;
out vec2 vTexCoord;

uniform vec2 u_resolution;
uniform vec2 u_translation;

void main()
{
    vTexCoord = aTexCoord;
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

const fragmentShader = `#version 300 es

precision mediump float;

in vec2 vTexCoord;

uniform sampler2D uSampler;

out vec4 fragColor;

void main()
{
    fragColor = texture(uSampler, vTexCoord);
}
`;

window.onload = () => {
    const lienzo = new Lienzo();

    const program = lienzo.createProgram(vertexShader, fragmentShader);
    const scene = new Scene();
    const material = new Material(program);
    const triangle = new GameObject(material, lienzo.primitives.SQUARE);

    scene.addGameObject(triangle);

    triangle.x = 600;

    let t = 0.01;
    setInterval(() => {
        t = t + 0.01;
        triangle.y = 200 + 100 * Math.sin(t);
        lienzo.clear();
        scene.draw();
    }, 5);
};
