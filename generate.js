function reserveSpot(x, z, e) {
    map[z*mapWidth + x] = e
}

function reserveAvenue(x, z, dx, dz) {
    for (var px = 0; px < dx; px++) {
        for (var pz = 0; pz < dz; pz++) {
            reserveSpot(x+px, z+pz, true)
        }
    }
}

function reserveSquare(x, z, w) {
    reserveAvenue(x, z, w, w)
}

function generateTerminal(x,z,h, type){
    if (x < 0 || z < 0 || x >= mapWidth || z >= mapWidth) return 
    if (map[z*mapWidth + x]) return

    total++
    if (type == 3) system++

    var e = spawn(Entity, x, -0.5, z)
    reserveSpot(x, z, e)
    e.type = type
    e.textures = textureSets[type]
    e.scale = [0.5, 0.5, 0.5]
    e.h = h
    e.b
    e.infect = function(loud) {
        if (this.type != 0) return false
        this.type = 1
        this.textures = textureSets[1]
        infected++
        if (loud) sfx(3)
        return true
    }
    e.system = function() {
        if (this.type != 0) return false
        this.type = 3
        this.textures = textureSets[3]
        system++
        return true
    }
    e.hit = function(t) {
        if (t.source == this) return
        if (t.frozen) {
            if (this.type < 2 && t.frozen) this.cure()
            t.alive = false
        } else if (t.kind == 2 && t.type == 1) {
            // infection!
            if (this.type == 2) {
                for (var i = 0; i < 4; i++) {
                    // spawn cure
                    var e = spawn(Ice, this.x, this.y, this.z)
                    e.source = this
                    e.froze()
                    e.wonderer = true
                    t.alive = false
                }
                sfx(6)
            } else if (this.infect()) t.alive = false
        }
    }
    e.cure = function() {
        if (this.type >= 2) return
        if (this.type == 1) {
            infected--
            cured++
            if (infected == 0) newLevel()
            else sfx(5)
        } else {
            sfx(4)
        }
        this.type = 2
        this.textures = textureSets[2]
    }
    e.postUpdate = function(delta) {
        switch (this.type) {
        case 1:
            if (rndf() < aggression/infected) {
                // spawn virus
                var e = spawn(Ice, this.x, this.y, this.z)
                e.virus()
                sfx(10)
            }
            break;
        case 3:
            if (rndf() < protection/system) {
                // spawn ice
                var e = spawn(Ice, this.x, this.y, this.z)
                sfx(11)
            }
            break;
        }
    }
}


function genesisBomb(x, z, w, density, height) {
    for (var px = 0; px < w; px++) {
        for (var pz = 0; pz < w; pz++) {
            if (rndf() < density) {
                generateTerminal(
                        x-w+px*2,
                        z-w+pz*2,
                        randi(height)+1, 0
                        )
            }
        }
    }
}

function generateCity() {
    var mid = mapWidth / 2


    // supervisor supertall
    generateTerminal(mid, mid, 8+randi(4), 3)
    // central square
    var sw = 2 + randi(2)
    reserveSquare(mid-sw, mid-sw, sw*2) 
    // central avenues
    reserveAvenue(mid-1, 0, 3, mapWidth)
    reserveAvenue(0, mid-1, mapWidth, 3)

    // place player
    xPos = -Math.round(mapWidth/3)
    zPos = -5
    yaw = 0.5
    // clean up room around player
    reserveSquare(-xPos-4, -zPos-4, 8)


    // squares
    for (var i = 0; i < mid/2; i++) {
        reserveSquare(randi(mapWidth), randi(mapWidth), 3+randi(3))
    }
    // avenues
    for (var i = 0; i < mid/4; i++) {
        reserveAvenue(randi(mapWidth), randi(mapWidth), 3, 8+randi(mid/2))
    }
    // streets
    for (var i = 0; i < mid/2; i++) {
        reserveAvenue(randi(mapWidth), randi(mapWidth), 8+randi(mid/2), 3)
    }


    
    // downtown
    genesisBomb(mid, mid, 6 + randi(2)*2, 0.1, 10)
    genesisBomb(mid, mid, 6 + randi(3)*2, 0.1, 8)
    genesisBomb(mid, mid, 7 + randi(3)*2, 0.1, 7)
    genesisBomb(mid, mid, 8 + randi(4)*2, 0.2, 5)
    genesisBomb(mid, mid, 10 + randi(4)*2, 0.2, 4)
    genesisBomb(mid, mid, 16, 0.1, 1)

    // districts
    for (var i = 0; i < mid/16; i++) {
        var nx = randi(mapWidth)
        var ny = randi(mapWidth)
        var nw = Math.round(mid/4 + randi(mid/4))
        genesisBomb(nx, ny, Math.round(nw/4), 0.4, 3)
        genesisBomb(nx, ny, nw, 0.6, 1)
    }


    // global population
    genesisBomb(mid, mid, mid, 0.1, 1)


}

function infectAt(pos, sys) {
    for (var i = pos; i < entities.length; i++) {
        if (entities[i].kind == 0) {
            if (sys) return entities[i].system()
            else return entities[i].infect()
        }
    }
    return false
}

function infectCity(sources, sys) {
    var infected = 0
    var attempts = 0
    while (infected < sources) {
        if (infectAt(randi(entities.length), sys)) infected++
        attempts++
        if (attempts > sources*7) break
    }
}


function newLevel() {
    level++
    _seed = level
    playerIce = 80 - level
    if (playerIce < 8) playerIce = 8
    aggression = 0.005 + level/200
    if (aggression > 0.3) aggression = 0.3

    map = []
    mapWidth = 64 // must be even!
    entities = []


    generateCity()
    var sys = 30-level
    if (sys < 8) sys = 8
    infectCity(sys, true)
    infectCity(8+level, false)

    // generate compas
    compas = spawn(Ice, 0, 0, 0)
    compas.virus()
    compas.solid = false
    compas.wonderer = false
    compas.lifeTime = 0
    compas.scale = [0.2, 0.2, 0.2]

    sfx(9)
}

function generateWorld() {
    // generate dashboard
    dashIce = []
    for (var i = 0; i < 16; i++) {
        var ice
        if (i > 7) ice = spawn(Ice, 0, 0.045, 0.14)
        else ice = spawn(Ice, 0, 0.03, 0.12)

        if (i > 7) ice.scale = [0.005, 0.005, 0.005]
        else ice.scale = [0.003, 0.003, 0.003]
        ice.pitch = 0
        ice.yaw = 0
        ice.roll = 0
        ice.wonderer = false
        ice.alive = false
        dashIce.push(ice)
    }
    newLevel()
}
