/**
 * Created by shaddy on 09.09.16.
 */
const MILK=1;
const ROAD=2;
const GLUCK=3;
const UP=1
const LEFT=2
const RIGHT=3
const DOWN=4
/**
 * 1-up
 * 2-left
 * 3-right
 * 4-down
 * @type {number[]}
 */
const DIRECTIONS=[UP,LEFT,RIGHT,DOWN];

var Field = function(xSize, ySize, x, y){
    var my = this;
    /**
     * field descriptor
     * @type {number[][]}
     */
    my.data=[
    ];
    /**
     * returns next possible direction
     */
    my.getNextPossibleDirection = function(){
        return ~~(Math.random() * 4);
    };
    /**
     * returns next x y for current vector
     * @returns {[number, number]}
     */
    my._getNextXY = function(dir){
        if (DIRECTIONS[dir] == UP){
            return [x, y + 1];
        }
        if (DIRECTIONS[dir] == LEFT){
            return [x - 1, y];
        }
        if (DIRECTIONS[dir] == RIGHT){
            return [x + 1, y];
        }
        if (DIRECTIONS[dir] == DOWN){
            return [x, y - 1];
        }
        throw "err:" + dir
    };
    /**
     * returns next x y for current vector, with checking field constrains
     * @returns {[number, number]}
     */
    my.getNextXY = function(){
        var retr=100;
        do{
            var r = my._getNextXY(my.getNextPossibleDirection());
            retr --;
            if (!retr){
                throw "1";
            }
            console.log("r:", r);
        } while (r[0] > xSize || r[0] < 0 || r[1] > ySize || r < 0 || my.getCell(r) == ROAD || my.getCell(r) == GLUCK);
        return r;
    };

    my.getCell = function(direction){
        return my.data[direction[0], direction[1]];
    };

    /**
     * foreach cell
     * @param cb
     */
    my.eachCell = function(cb){
        for (var x=0; x< xSize; x++){
            my.data[x]=my.data[x]|| [];
            for (var y=0; y<ySize; y++){
                my.data[x][y]=my.data[x][y]||MILK;
                cb(x, y, my.data[x][y]);
            }
        }
    };
    my._iter = function(){
        my.data[x][y] = ROAD;
        var xy = my.getNextXY();
        x = xy[0];
        y = xy[1];
        console.log(x,y)
    };
    my.createField = function(){
        my.eachCell(function(x, y){
            my.data[x][y] = MILK;
        })
    }
};
var f = new Field(32,32, 8, 8);
for (var i=0; i < 10; i++){
    f.createField();
    f._iter();
}
console.log(f.data.map(function(a){
    return a.join(",");
}));