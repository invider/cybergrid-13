/**
 * Created by shaddy on 09.09.16.
 */
const MILK=1;
const ROAD=2;
const GLUCK=3;
var Field = function(xSize, ySize, x, y){
    const UP=1;
    const LEFT=2;
    const DOWN=3;
    const RIGHT=4;
    /**
     * 1-up
     * 2-left
     * 3-right
     * 4-down
     * @type {number[]}
     */
    const DIRECTIONS=[UP,LEFT,RIGHT,DOWN];
    const POSSIBILITIES=[0.7, 0.5, 0.5, 0.2];

    var my = this;
    /**
     * field descriptor
     * @type {number[][]}
     */
    my.data=[
    ];
    var lastDirections=[-1,-1,-1,-1];
    /**
     * returns next possible direction
     * TODO:add different possibilities for directions
     * TODO:use randomInt
     */
    my.getNextPossibleDirection = function(){
        return choseRandom(DIRECTIONS, POSSIBILITIES);
    };
    /**
     * returns next x y for current vector
     * @returns {[number, number]}
     */
    my._getNextXY = function(dir){
        switch(dir){
            case UP:
                return [x, y + 1];
            case LEFT:
                return [x - 1, y];
            case RIGHT:
                return [x + 1, y];
            case DOWN:
                return [x, y - 1];
        }
        throw "err:" + dir
    };
    /**
     * invert direction
     * TODO: optimize this
     * @param dir
     * @returns {number}
     */
    var inv=function(dir){
        switch(dir){
            case UP:
                return DOWN;
            case LEFT:
                return RIGHT;
            case RIGHT:
                return LEFT;
            case DOWN:
                return UP;
        }
    };
    /**
     * checking last direction to avoid fields clustering
     * @param direction
     * @returns {boolean}
     */
    var checkDirectionComplexity = function(direction){
        if (lastDirections[0] == inv(direction) && lastDirections[1] == inv(direction) && lastDirections[2] == inv(direction)){
            return false;
        }
        return true;
    };
    /**
     * returns next x y for current vector, with checking field constrains
     * @returns {[number, number]}
     */
    my.getNextXY = function(){
        var retr=10000;
        do{
            var dir = my.getNextPossibleDirection()
            var r = my._getNextXY(dir);
            retr --;
            if (!retr){
                throw "1";
            }
        } while (
            r[0] >= xSize || r[0] < 0 || r[1] >= ySize || r[1] < 0
            || my.getCell(r) == ROAD || my.getCell(r) == GLUCK
            || !checkDirectionComplexity(dir)
        );
        lastDirections.unshift(dir);
        lastDirections.pop();
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
    /**
     * calls one iterration of field generation
     * @private
     */
    my._iter = function(){
        my.data[x][y] = ROAD;
        var xy = my.getNextXY();
        x = xy[0];
        y = xy[1];
    };
    /**
     * creates field with MILK field types
     */
    my.createField = function(){
        my.eachCell(function(x, y){
            my.data[x][y] = MILK;
        })
    }
    my.generate = function(length){
        my.createField();
        for (var i=0; i < length; i++){
            my._iter();
        }
    }
};
//
// TODO: remove this code in production
//
if (typeof(window) == "undefined"){
    var W=100;
    var f = new Field(W,W, W/2, W/2);
    f.generate(100);
    console.log(f.data.map(function(a){
        return a.join(",");
    }));
}
