function WallSegment(x1, z1, x2, z2, y, h, type) {

    var vtxPos = []
    var texCoord = []
    var cx = 0
    var cy = 0
    var cs = 1
    /**
     * maps coordinates to matrixs
     * @param x
     * @param y
     * @param z
     * @param cx
     * @param cy
     */
    function mapTextToCoord(x,y,z,cx,cy){
        vtxPos = vtxPos.concat([x,y,z]);
        texCoord = texCoord.concat([cx,cy]);
        //console.log(vtxPos)
    }
    mapTextToCoord(x1,y,z1,cx,cy)
    mapTextToCoord(x1,y+h,z1,cx,cy + cs)
    //mapTextToCoord(x1,y,z1,cx,cy)
    mapTextToCoord(x2,y,z2,cx + cs,cy)
    mapTextToCoord(x2,y,z2,cx + cs,cy)
    mapTextToCoord(x2,y + h,z2,cx + cs,cy + cs)
    mapTextToCoord(x1,y + h,z1,cx,cy + cs)

    this.vposBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vposBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vtxPos), gl.STATIC_DRAW);
    this.vposBuffer.itemSize = 3;
    this.vposBuffer.numItems = 6;

    this.texCoordBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoord), gl.STATIC_DRAW);
    this.texCoordBuf.itemSize = 2;
    this.texCoordBuf.numItems = 6;

    this.type = type
    this.frame = 0
    this.time = 0
    this.speed = 0.1 + Math.random()

    this.render = function(delta) {
        this.time += delta * this.speed
        if (this.time > 1) {
            this.time = 0
            this.frame++
            if (this.frame >= textureSets[this.type].length) {
                this.frame = 0
            }
        }
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, textureSets[this.type][this.frame]);
        gl.uniform1i(shaderProgram.samplerUniform, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuf);
        gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, this.texCoordBuf.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vposBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.vposBuffer.itemSize, gl.FLOAT, false, 0, 0);

        setMatrixUniforms();
        gl.drawArrays(gl.TRIANGLES, 0, this.vposBuffer.numItems);

    }
    segments.push(this)
}
