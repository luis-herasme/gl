type UniformType =
    | 'uniform1fv'
    | 'uniform2fv'
    | 'uniform3fv'
    | 'uniform4fv'
    | 'uniform1iv'
    | 'uniform2iv'
    | 'uniform3iv'
    | 'uniform4iv';

export type UniformValue = Float32Array | Int32Array;

export type UniformDefinition = {
    location: WebGLUniformLocation | null;
    type: UniformType;
    data: UniformValue;
};

export type UniformData = { [uniformName: string]: UniformValue };
export type UniformDefinitions = { [uniformName: string]: UniformDefinition };

export function getUniforms(
    gl: WebGL2RenderingContext,
    data: UniformData,
    program: WebGLProgram
): UniformDefinitions {
    const uniformDefinitions: UniformDefinitions = {};

    for (const uniformName of Object.keys(data)) {
        uniformDefinitions[uniformName] = getUniformDefinition(
            gl,
            uniformName,
            data[uniformName],
            program
        );
    }

    return uniformDefinitions;
}

export function getUniformDefinition(
    gl: WebGL2RenderingContext,
    uniformName: string,
    value: UniformValue,
    program: WebGLProgram
): UniformDefinition {
    const uniformLocation = gl.getUniformLocation(program, uniformName);
    const uniformDefinition: UniformDefinition = {
        data: value,
        location: uniformLocation,
        type: getUniformDataType(value)
    };
    return uniformDefinition;
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
