function initGL(canvas) {
    try {
        gl = canvas.getContext("experimental-webgl");
        expandCanvas()
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
    } catch (e) {
        alert("no webgl!");
    }
}

function generateWorld() {
    var vertexCount = 0;
    var vertexPositions = [];
    var vertexTextureCoords = [];
    worldVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, worldVertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPositions), gl.STATIC_DRAW);
    worldVertexPositionBuffer.itemSize = 3;
    worldVertexPositionBuffer.numItems = vertexCount;

    worldVertexTextureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, worldVertexTextureCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexTextureCoords), gl.STATIC_DRAW);
    worldVertexTextureCoordBuffer.itemSize = 2;
    worldVertexTextureCoordBuffer.numItems = vertexCount;

    generateWalls()

    new Obj(1, 0, 0)
    new Obj(-1, 0, 0)
    new Obj(0, 0, 1)
    new Obj(0, 0, -1)
    objects[1].wall = 1
    objects[2].wall = 2
    objects[3].wall = 3

    objects[0].dx = 0.1
    objects[1].dx = -0.1
    objects[2].dz = 0.1
    objects[3].dz = -0.1
}
