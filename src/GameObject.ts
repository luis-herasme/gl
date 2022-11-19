import { Material } from './Material';
import { Mesh } from './Mesh';

export class GameObject {
    private material: Material;
    private position: Float32Array;
    private mesh: Mesh;

    constructor(material: Material, mesh: Mesh) {
        this.mesh = mesh;
        this.material = material;
        this.position = new Float32Array([0, 0]);
    }

    set x(value: number) {
        this.position[0] = value;
    }

    set y(value: number) {
        this.position[1] = value;
    }

    draw() {        
        this.material.use();
        this.mesh.use();
        this.material.program.updateUniformData('u_translation', this.position);
        this.material.program.setUniforms();
    }
}
