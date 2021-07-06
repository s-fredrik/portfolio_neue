class Mesh {
    gl = null;

    VBO = null;
    IBO = null;

    texture = null;
    indices = null;
    vertices = null;
    program = null;

    positionAttribLocation = null;
    texCoordAttribLocation = null;

    constructor(vertices, indices, texture, program, gl) {

        this.gl = gl;
        this.indices = new Uint16Array(indices);
        this.vertices = new Float32Array(vertices)
        this.program = program;

        this.VBO = gl.createBuffer();
        this.IBO = gl.createBuffer();

        this.positionAttribLocation = gl.getAttribLocation(this.program, 'vertPosition');
        this.texCoordAttribLocation = gl.getAttribLocation(this.program, 'vertTexCoord');

        var meshTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, meshTexture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texImage2D(
            gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
            gl.UNSIGNED_BYTE,
            texture
        );
        this.texture = meshTexture;
        gl.bindTexture(gl.TEXTURE_2D, null);

    }

    draw() {

        var gl = this.gl;

        gl.bindBuffer(gl.ARRAY_BUFFER, this.VBO);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.IBO);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);

        gl.vertexAttribPointer(
            this.positionAttribLocation, // Attribute location
            3, // Number of elements per attribute
            gl.FLOAT, // Type of element
            gl.FALSE,
            5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
            0 // Offset from the beginning of a single vertex to this attribute
        );
        gl.vertexAttribPointer(
            this.texCoordAttribLocation, // Attribute location
            2, // Number of elements per attribute
            gl.FLOAT, // Type of elements
            gl.FALSE,
            5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
            3 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
        );

        gl.enableVertexAttribArray(this.positionAttribLocation);
        gl.enableVertexAttribArray(this.texCoordAttribLocation);

        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.activeTexture(gl.TEXTURE0);

        gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);

    }
}