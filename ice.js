function Ice() {
    this.kind = 2
    this.frozen = false
    this.wonderer = true
    this.lifeTime = 20

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

    // shoot ice
    this.froze = function() {
        this.frozen = true
        this.wonderer = false
        var dx = 5*Math.sin(yaw)
        var dz = 5*Math.cos(yaw)
        this.dx = dx
        this.dz = dz
        this.type = 2
        this.textures = textureSets[2]
    }

    this.virus = function() {
        this.lifeTime = 20
        this.type = 1
        this.textures = textureSets[1]
    }

    this.keep = 0
    this.update = function(delta) {
        this.keep -= delta
        if (this.wonderer && this.keep < 0) {
            // new direction
            var dir = Math.PI*2*rndf()
            var speed = 0.3 + rndf()*1.5
            if (this.type == 0) speed /= 4
            this.keep = 2 + rndf()*8
            this.dx = speed * Math.sin(dir)
            this.dz = speed * Math.cos(dir)
            if (this.x < -mapWidth
                    || this.x > mapWidth*2
                    || this.z < -mapWidth
                    || this.z > mapWidth*2) this.alive = false
        }
        if (this.lifeTime > 0) {
            this.lifeTime -= delta
            if (this.lifeTime <= 0) this.alive = false
        }
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
