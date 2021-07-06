var vertexShaderText = `
precision mediump float;

attribute vec3 vertPosition;
attribute vec2 vertTexCoord;
varying vec2 fragTexCoord;

uniform mat4 mWorld;
uniform mat4 mView;
uniform mat4 mProjection;

void main()
{
  fragTexCoord = vertTexCoord;
  gl_Position = mProjection * mView * mWorld * vec4(vertPosition, 1.0);
}
`

var fragmentShaderText = `
precision mediump float;
uniform sampler2D sampler;

varying vec2 fragTexCoord;
void main()
{
  gl_FragColor = texture2D(sampler, fragTexCoord);
}
`

var InitializeProfileGL = function() {
  
    var canvas = document.getElementById('profile-canvas');
    var gl = canvas.getContext('webgl');

    if (!gl) {
        console.log('WebGL not supported, falling back on experimental-webgl');
        gl = canvas.getContext('experimental-webgl');
    }

    if (!gl) {
        alert('Your browser does not support WebGL');
    }

    gl.clearColor(0.75, 0.85, 0.8, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
    gl.frontFace(gl.CCW);

    //
    // Create shaders
    //
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vertexShader, vertexShaderText);
    gl.shaderSource(fragmentShader, fragmentShaderText);

    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexShader));
        return;
    }

    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.error('ERROR compiling fragment shader!', gl.getShaderInfoLog(fragmentShader));
        return;
    }

    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('ERROR linking program!', gl.getProgramInfoLog(program));
        return;
    }
    gl.validateProgram(program);
    if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
        console.error('ERROR validating program!', gl.getProgramInfoLog(program));
        return;
    }

    //
    // Create buffer
    //
    var boxVertices =
    [ // X, Y, Z           U, V
        // Top
        -1.0, 1.0, -1.0,   0, 0,
        -1.0, 1.0, 1.0,    0, 1,
        1.0, 1.0, 1.0,     1, 1,
        1.0, 1.0, -1.0,    1, 0,

        // Left
        -1.0, 1.0, 1.0,    0, 0,
        -1.0, -1.0, 1.0,   1, 0,
        -1.0, -1.0, -1.0,  1, 1,
        -1.0, 1.0, -1.0,   0, 1,

        // Right
        1.0, 1.0, 1.0,    1, 1,
        1.0, -1.0, 1.0,   0, 1,
        1.0, -1.0, -1.0,  0, 0,
        1.0, 1.0, -1.0,   1, 0,

        // Front
        1.0, 1.0, 1.0,    1, 1,
        1.0, -1.0, 1.0,    1, 0,
        -1.0, -1.0, 1.0,    0, 0,
        -1.0, 1.0, 1.0,    0, 1,

        // Back
        1.0, 1.0, -1.0,    0, 0,
        1.0, -1.0, -1.0,    0, 1,
        -1.0, -1.0, -1.0,    1, 1,
        -1.0, 1.0, -1.0,    1, 0,

        // Bottom
        -1.0, -1.0, -1.0,   1, 1,
        -1.0, -1.0, 1.0,    1, 0,
        1.0, -1.0, 1.0,     0, 0,
        1.0, -1.0, -1.0,    0, 1,
    ];
    
    var biggerBoxVertices =
    [ // X, Y, Z           U, V
        // Top
        0.5, 3.5, 0.5,   0, 0,
        0.5, 3.5, 3.5,    0, 1,
        3.5, 3.5, 3.5,     1, 1,
        3.5, 3.5, 0.5,    1, 0,

        // Left
        0.5, 3.5, 3.5,    0, 0,
        0.5, 0.5, 3.5,   1, 0,
        0.5, 0.5, 0.5,  1, 1,
        0.5, 3.5, 0.5,   0, 1,

        // Right
        3.5, 3.5, 3.5,    1, 1,
        3.5, 0.5, 3.5,   0, 1,
        3.5, 0.5, 0.5,  0, 0,
        3.5, 3.5, 0.5,   1, 0,

        // Front
        3.5, 3.5, 3.5,    1, 1,
        3.5, 0.5, 3.5,    1, 0,
        0.5, 0.5, 3.5,    0, 0,
        0.5, 3.5, 3.5,    0, 1,

        // Back
        3.5, 3.5, 0.5,    0, 0,
        3.5, 0.5, 0.5,    0, 1,
        0.5, 0.5, 0.5,    1, 1,
        0.5, 3.5, 0.5,    1, 0,

        // Bottom
        0.5, 0.5, 0.5,   1, 1,
        0.5, 0.5, 3.5,    1, 0,
        3.5, 0.5, 3.5,     0, 0,
        3.5, 0.5, 0.5,    0, 1,
    ];

    var boxIndices =
    [
        // Top
        0, 1, 2,
        0, 2, 3,

        // Left
        5, 4, 6,
        6, 4, 7,

        // Right
        8, 9, 10,
        8, 10, 11,

        // Front
        13, 12, 14,
        15, 14, 12,

        // Back
        16, 17, 18,
        16, 18, 19,

        // Bottom
        21, 20, 22,
        22, 20, 23
    ];

    //
    // Create Texture
    //

    var boxMesh = new Mesh(boxVertices, boxIndices, document.getElementById('crate-image'), program, gl);
    var biggerBoxMesh = new Mesh(biggerBoxVertices, boxIndices, document.getElementById('crate-image-2'), program, gl);

    //Tells OpenGL which program should be active
    gl.useProgram(program);

    var matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
    var matViewUniformLocation = gl.getUniformLocation(program, 'mView');
    var matProjectionUniformLocation = gl.getUniformLocation(program, 'mProjection');

    var worldMatrix = new Float32Array(16);
    var viewMatrix = new Float32Array(16);
    var projectionMatrix = new Float32Array(16);
    glMatrix.mat4.identity(worldMatrix);
    glMatrix.mat4.lookAt(viewMatrix, [0, 0, -10], [0, 0, 0], [0, 1, 0]);
    glMatrix.mat4.perspective(projectionMatrix, glMatrix.glMatrix.toRadian(45), canvas.width / canvas.height, 0.1, 1000.0);

    gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
    gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
    gl.uniformMatrix4fv(matProjectionUniformLocation, gl.FALSE, projectionMatrix);



    //
    // Main render loop
    //
    var identityMatrix = new Float32Array(16);
    glMatrix.mat4.identity(identityMatrix);
    var angle = 0

    var xRotationMatrix = new Float32Array(16);
    var yRotationMatrix = new Float32Array(16);
    var zRotationMatrix = new Float32Array(16);

    var loop = function () {
        angle = performance.now() / 1000 / 6 * 2 * Math.PI
        glMatrix.mat4.rotate(xRotationMatrix, identityMatrix, angle, [1, 0, 0]);
        glMatrix.mat4.rotate(yRotationMatrix, identityMatrix, angle / 2, [0, 1, 0]);
        glMatrix.mat4.rotate(zRotationMatrix, identityMatrix, angle / 3, [0, 0, 1]);
        glMatrix.mat4.mul(worldMatrix, xRotationMatrix, yRotationMatrix);
        glMatrix.mat4.mul(worldMatrix, zRotationMatrix, worldMatrix);
        gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);

        gl.clearColor(0.75, 0.85, 0.8, 1.0);
        gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

        boxMesh.draw();
        biggerBoxMesh.draw();

        requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
  
}

document.getElementsByTagName('body')[0].onload = function () { InitializeProfileGL() }
