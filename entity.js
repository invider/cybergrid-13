function Entity(x, y, z) {

    this.alive = true

    this.x = x
    this.y = y
    this.z = z

    this.dx = 0
    this.dy = 0
    this.dz = 0
    this.pitch = 0
    this.yaw = 0
    this.roll = 0 

    this.init = function() {
        // generate geometry
        var vtxPos = []
        var texCoord = []

        vtxPos.push(-0.5)
        vtxPos.push(0)
        vtxPos.push(-0.5)
        texCoord.push(0)
        texCoord.push(0);
        
        vtxPos.push(0.5)
        vtxPos.push(0)
        vtxPos.push(-0.5)
        texCoord.push(1)
        texCoord.push(0);

        vtxPos.push(-0.5)
        vtxPos.push(0)
        vtxPos.push(0.5)
        texCoord.push(0)
        texCoord.push(1);

        vtxPos.push(0.5)
        vtxPos.push(0)
        vtxPos.push(0.5)
        texCoord.push(1)
        texCoord.push(1);

        this.vposBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vposBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vtxPos), gl.STATIC_DRAW);
        this.vposBuffer.itemSize = 3;
        this.vposBuffer.numItems = 4;

        this.texCoordBuf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoord), gl.STATIC_DRAW);
        this.texCoordBuf.itemSize = 2;
        this.texCoordBuf.numItems = 4;

        // asign textures
        this.textures = textureSets[0]
        this.frame = 0
        this.frameTime = 0
        this.frameSpeed = 0.1 + Math.random()
    }

    this.nextFrame = function(delta) {
        this.frameTime += delta * this.frameSpeed
        if (this.frameTime > 1) {
            this.frameTime = 0
            this.frame++
            if (this.frame >= this.textures.length) {
                this.frame = 0
            }
        }
    }
    
    this.render = function(delta) {
        // update
        this.x += this.dx*delta
        this.y += this.dy*delta
        this.z += this.dz*delta
        this.roll += 0.4*delta
        this.yaw += 0.2*delta
        //this.pitch += 0.1*delta
        this.nextFrame(delta)

        // render
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.textures[this.frame]);
        gl.uniform1i(shaderProgram.samplerUniform, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuf);
        gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, this.texCoordBuf.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vposBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.vposBuffer.itemSize, gl.FLOAT, false, 0, 0);

        // rotate and translate
        mvPushMatrix()
        mat4.translate(mvMatrix, [-this.x, -this.y, -this.z]);
        mat4.rotate(mvMatrix, -this.roll, [0, 0, 1]);
        mat4.rotate(mvMatrix, -this.pitch, [1, 0, 0]);
        mat4.rotate(mvMatrix, -this.yaw, [0, 1, 0]);

        setMoveUniforms();

        // draw
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.vposBuffer.numItems);

        mvPopMatrix()
    }
}
