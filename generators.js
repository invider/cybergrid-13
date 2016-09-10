const FIELD_SIZE=32
const HASH_SIZE=1024
function cb(sx, sy, by, h, type) {
    if (sx < 0) sx = 0; else if (sx > HASH_SIZE) sx = HASH_SIZE
    if (sy < 0) sy = 0; else if (sy > HASH_SIZE) sy = HASH_SIZE
    var shift = sy*HASH_SIZE + sx
    if (blocks[shift]) {
        return blocks[shift]
    }

    var x = sx - 64
    var y = sy - 64
    for (var i = 0; i < h; i++) {
        new WallSegment(x+1, y, x, y, by, 1, type)
        new WallSegment(x, y, x, y+1, by, 1, type)
        new WallSegment(x+1, y+1, x+1, y, by, 1, type)
        new WallSegment(x, y+1, x+1, y+1, by, 1, type)
        by++
    }
}

function cw(sx, sy, dx, dy, y, h, len) {
    var type = randomInt(textureSets.length)
    for (var i = 0; i < len; i++) {
        cb(sx, sy, y, h, type)
        sx += dx
        sy += dy
    }
}

function generateWalls() {
    for (var i = 0; i < 64; i++) {
        var x = randomInt(FIELD_SIZE)+30
        var y = randomInt(FIELD_SIZE)+30
        var dx = 0, dy = 0
        //var len = Math.random() * 16
        var len = 1
        var rv = Math.random()
        if (rv < 0.25) dx = 1;
        else if (rv < 0.5) dx = -1;
        else if (rv < 0.75) dy = 1;
        else dy = -1

        var by = 0
        if (Math.random() < 0.2) by = -1;
        else if (Math.random() < 0.2) by = 1;
        var h = Math.floor(1 + Math.random()*2)
        cw(x, y, dx, dy, by, h, len)
    }

    for (var i = 0; i < FIELD_SIZE; i++) {
        var x = randomInt(FIELD_SIZE)+64
        var y = randomInt(FIELD_SIZE)+64
        var dx = 0, dy = 0
        var len = Math.random() * 16
        var rv = Math.random()
        if (rv < 0.25) dx = 1;
        else if (rv < 0.5) dx = -1;
        else if (rv < 0.75) dy = 1;
        else dy = -1
        var by = 0
        var h = 1
        cw(x, y, dx, dy, by, h, len)
    }
}

function generateCell(x,y,type){
    var by = 1;
    new WallSegment(x+1, y, x, y, by, 1, type)
    new WallSegment(x, y, x, y+1, by, 1, type)
    new WallSegment(x+1, y+1, x+1, y, by, 1, type)
    new WallSegment(x, y+1, x+1, y+1, by, 1, type)
}


function generateField(){
    var W = 20;
    var field=new Field(W,W,W/2,W/2);
    field.generate(20);
    field.eachCell(function(x, y, cell){
        if (cell === MILK && !field.rowIsNear(x,y)){
            return
        }
        generateCell(W/2 - x, W/2 - y, cell);
    })
}

function generateWorld() {
    generateField()
    //generateWalls()

    var e = spawn(Entity, 1, 0, 0)
    /*
    e = spawn(Entity, -1, -0.3, 0)
    e.dx = -0.2

    e = spawn(Entity, 0, -0.3, 1)
    e.dz = 0.2

    e = spawn(Entity, 0, -0.3, -1)
    e.dz = -0.2
    */

    //e = spawn(Signal, 0, 0, 0)
    //e.scale = [2, 2, 2]
}
