import { loadImage } from "./assets";

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
        this.loadTexture();
    }

    async loadTexture() {
        const banana = await loadImage("banana.png");
        console.log(banana)
        this.gl.bindVertexArray(this.vertexArrayObject);
        const texCoordBufferData = new Float32Array([
            0, 0,
            0, 1,
            1, 1,
            0, 0,
            1, 0,
            1, 1,

        ]);

        const gl = this.gl;

        const texCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, texCoordBufferData, gl.STATIC_DRAW);
        gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(1);
        
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)

        // const pixels = new Uint8Array([
        //     255, 255,   255,  0, 0, 0, 255, 255,   255,  0, 0, 0, 255, 255,   255,  0, 0, 0, 255, 255,   255,  0, 0, 0,
        //     0, 0, 0,    255, 255, 255,  0, 0, 0,    255, 255, 255,  0, 0, 0,    255, 255, 255,  0, 0, 0,    255, 255, 255,  
        //     255, 255,   255,  0, 0, 0, 255, 255,   255,  0, 0, 0, 255, 255,   255,  0, 0, 0, 255, 255,   255,  0, 0, 0,
        //     0, 0, 0,    255, 255, 255,  0, 0, 0,    255, 255, 255,   0, 0, 0,    255, 255, 255,  0, 0, 0,    255, 255, 255,  
        //     255, 255,   255,  0, 0, 0, 255, 255,   255,  0, 0, 0, 255, 255,   255,  0, 0, 0, 255, 255,   255,  0, 0, 0,
        //     0, 0, 0,    255, 255, 255,  0, 0, 0,    255, 255, 255,  0, 0, 0,    255, 255, 255,  0, 0, 0,    255, 255, 255,  
        //     255, 255,   255,  0, 0, 0, 255, 255,   255,  0, 0, 0, 255, 255,   255,  0, 0, 0, 255, 255,   255,  0, 0, 0,
        //     0, 0, 0,    255, 255, 255,  0, 0, 0,    255, 255, 255,   0, 0, 0,    255, 255, 255,  0, 0, 0,    255, 255, 255,  
        // ]);
        
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 466, 512, 0, gl.RGB, gl.UNSIGNED_BYTE, banana);
        gl.generateMipmap(gl.TEXTURE_2D);

    }

    use() {
        this.gl.bindVertexArray(this.vertexArrayObject);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
        this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
    }
}
