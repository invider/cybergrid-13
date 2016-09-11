/**
 * Created by shaddy on 11.09.16.
 */
var Game = function(){
    this.lvl=0;
    this.field=field;
};
var p = Game.prototype;
p.init=function(){
    this.field=new Field(W,W,W/2,W/2);
    field.generate();
    field.eachCell(function(x, y, cell){
        if (cell === MILK && !field.roadIsNear(x,y)){
            return
        }
        generateCell(W/2 - x, W/2 - y, cell);
    })
}
