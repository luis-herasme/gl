type UniformType =
    | 'uniform1fv'
    | 'uniform2fv'
    | 'uniform3fv'
    | 'uniform4fv'
    | 'uniform1iv'
    | 'uniform2iv'
    | 'uniform3iv'
    | 'uniform4iv';

export type UniformDefinition = {
    location: WebGLUniformLocation | null;
    type: UniformType;
    data: Float32Array | Int32Array;
};

export type UniformData = { [uniformName: string]: Float32Array | Int32Array };

export function getUniforms(
    gl: WebGL2RenderingContext,
    data: UniformData,
    program: WebGLProgram
): UniformDefinition[] {
    const uniformDefinitions: UniformDefinition[] = [];

    for (const uniformName of Object.keys(data)) {
        const uniformLocation = gl.getUniformLocation(program, uniformName);
        const uniformData = data[uniformName];

        const uniformDefinition: UniformDefinition = {
            data: uniformData,
            location: uniformLocation,
            type: getUniformDataType(uniformData)
        };

        uniformDefinitions.push(uniformDefinition);
    }

    return uniformDefinitions;
}

function getUniformDataType(data: Float32Array | Int32Array): UniformType {
    if (data.length > 4 || data.length == 0) {
        throw Error('Invalid uniform data length.');
    }

    let type = '';

    if (data instanceof Float32Array) {
        type = 'f';
    } else if (data instanceof Int32Array) {
        type = 'i';
    }

    if (type !== 'f' && type !== 'i') {
        throw Error('Invalid uniform type');
    }

    return `uniform${data.length}${type}v` as UniformType;
}
