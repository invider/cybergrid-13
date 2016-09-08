function Signal() {

    this.time = 60

    this.update = function(delta) {
        this.time -= delta
        if (this.time < 0) this.alive = false
        this.x += this.dx * delta
        this.y += this.dy * delta 
        this.z += this.dz * delta
    }

    this.init = function() {
        // generate geometry
        var vtxPos = []
        var texCoord = []

        var vtxPos = [
                1, 0, 1,
                -1, 0, 1,
                1, 0, -1,
                -1, 0, -1,

                -1, 0.2, -1,
                -1, 0.2, 1,

                -1, 0.2, -1,
                1, 0.2, -1,

                1, 0, -1,
                1, 0, 1,
        ]
        var texPos = [
                0, 0,
                1, 0,
                0, 1, 
                1, 1,
                0, 0,
                1, 0,
                0, 1, 
                1, 1,
                0, 1, 
                0, 1, 
        ]
        this.initBufs(vtxPos, texPos, 10)

        // asign textures
        this.textures = textureSets[0]
        this.frame = 0
        this.frameTime = 0
        this.frameSpeed = 0.1 + Math.random()
    }
}
Signal.prototype = new Entity()

