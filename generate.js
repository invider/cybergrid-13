function reserveSpot(x, z, e) {
    map[z*mapWidth + x] = e
}

function reserveAvenue(x, z, dx, dz) {
    for (var px = 0; px < dx; px++) {
        for (var pz = 0; pz < dz; pz++) {
            reserveSpot(z+pz, x+px, true)
        }
    }
}

function reserveSquare(x, z, w) {
    reserveAvenue(x, z, w, w)
}

function generateTerminal(x,z,h, type){
    if (x < 0 || z < 0 || x >= mapWidth || z >= mapWidth) return 
    if (map[z*mapWidth + x]) return

    var e = spawn(Entity, x, -0.5, z)
    reserveSpot(x, z, e)
    e.type = type
    e.textures = textureSets[type]
    e.scale = [0.5, 0.5, 0.5]
    e.h = h
    e.b
    e.infect = function() {
        if (this.type != 0) return false
        this.type = 1
        this.textures = textureSets[1]
        return true
    }
    e.system = function() {
        if (this.type != 0) return false
        this.type = 3
        this.textures = textureSets[3]
        return true
    }
    e.cure = function() {
        this.type = 2
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
    for (var i = 0; i < mid/8; i++) {
        var nx = randi(mapWidth)
        var ny = randi(mapWidth)
        var nw = Math.round(mid/4 + randi(mid/4))
        genesisBomb(nx, ny, Math.round(nw/4), 5)
        genesisBomb(nx, ny, nw, 2)
    }


    // global population
    genesisBomb(mid, mid, mid, 0.1, 1)


    xPos = -mapWidth/3
    zPos = -5
    yaw = 0.5
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


function generateLevel() {
    _seed = level
    map = []
    mapWidth = 64 // must be even!
    entities = []

    generateCity()
    infectCity(10, true)
    infectCity(5, false)

    sfx(0)
}

function generateWorld() {
    // generate dashboard
    dashIce = []
    for (var i = 0; i < 8; i++) {
        var ice = spawn(Ice, 0, 0.04, 0.12)
        ice.scale = [0.003, 0.003, 0.003]
        ice.pitch = 0
        ice.yaw = 0
        ice.roll = 0
        ice.alive = false
        dashIce.push(ice)
    }

    generateLevel()
}
