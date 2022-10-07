export class Mesh {
    private buffer: WebGLBuffer;
    private vertexArrayObject: WebGLVertexArrayObject;
    private gl: WebGL2RenderingContext;

    constructor(gl: WebGL2RenderingContext, buffer: WebGLBuffer) {
        this.buffer = buffer;
        this.gl = gl;

        const vertexArrayObject = gl.createVertexArray();
        gl.bindVertexArray(vertexArrayObject);
        gl.enableVertexAttribArray(0);
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
        if (!vertexArrayObject) throw Error('Error creating VAO');

        this.vertexArrayObject = vertexArrayObject;
    }

    use() {
        this.gl.bindVertexArray(this.vertexArrayObject);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
        this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
    }
}
