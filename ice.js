function Ice() {
    this.kind = 2

    this.init = function() {
        // generate additional geometry
        var vtxPos = []
        var texCoord = []
        var vtxPos = [
            -1, -1, -1, -1, -1,  1,  1, -1, -1,
            -1, -1,  1,  1, -1, -1,  1, -1, 1,

            -1,  1, -1, -1,  1,  1,  1,  1, -1,
            -1,  1,  1,  1,  1, -1,  1,  1, 1,
        ]
        var texPos = [
            0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 1, 1,
            0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 1, 1,
        ]
        this.initBufs(vtxPos, texPos, 12)
        // save additional buffers before calling the prototype
        this.vposBuffer2 = this.vposBuffer
        this.texCoordBuf2 = this.texCoordBuf

        Ice.prototype.init.call(this)

        this.solid = true
        this.radius = 0.2
        this.scale = [0.05, 0.05, 0.05]
        this.frameSpeed = 7
    }

    this.update = function(delta) {
        this.x += this.dx * delta
        this.y += this.dy * delta 
        this.z += this.dz * delta
        this.roll +=6.4*delta
        this.yaw += 0.8*delta
        this.nextFrame(delta)
    }

    this.postRender = function() {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuf2);
        gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, this.texCoordBuf2.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vposBuffer2);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.vposBuffer2.itemSize, gl.FLOAT, false, 0, 0);

        gl.drawArrays(gl.TRIANGLES, 0, this.vposBuffer2.numItems);
    }

}
Ice.prototype = new Entity()
