import { Program } from './Program';

export class Material {
    // private uniforms: UniformDefinitions;
    public program: Program;

    constructor(program: Program
        // , uniforms: UniformDefinitions
        ) {
        // this.uniforms = uniforms;
        this.program = program;
    }

    use() {
        this.program.use();
    }
}
