const FIELD_SIZE=32
const HASH_SIZE=1024

function generateCell(x,y,type){
    var e = spawn(Entity, x, 0.5, y)
    e.type = type
    e.textures = textureSets[type]
    e.scale = [0.5, 0.5, 0.5]
}

function generateTerminal(x,z,h, type){
    var e = spawn(Entity, x, -0.5, z)
    e.type = type
    e.textures = textureSets[type]
    e.scale = [0.5, 0.5, 0.5]
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

function generateCity() {
    var W = 20
    for (var i = 0; i < 40; i++) {
        var x = randomInt(20) - 10
        var z = randomInt(20) - 10
        generateTerminal(x, z, 1, 3)
    }
}

function generateWorld() {
    //generateField()
    generateCity()

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

    // random stream
    for (var i = 0; i < 100; i++) {
        console.log(rand(100))
    }
}
