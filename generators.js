const FIELD_SIZE=32
const HASH_SIZE=1024

function generateCell(x,y,type){
    var e = spawn(Entity, x, -1.5, y);
    e.type = type;
    e.textures = textureSets[type];
    e.scale = [0.5, 0.5, 0.5]
}


function generateField(){
    var W = 20;
    var field=new Field(W,W,W/2,W/2);
    field.generate(20);
    field.eachCell(function(x, y, cell){
        if (cell === MILK && !field.roadIsNear(x,y)){
            return
        }
        generateCell(W/2 - x, W/2 - y, cell);
    })
}

function generateWorld() {
    generateField()

    spawn(Ghost, 1, -0.5, 1)
}
