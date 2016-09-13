// extend window with universal requestAnimFrame
window.requestAnimFrame = (function() {
  return window.requestAnimationFrame ||
         window.webkitRequestAnimationFrame ||
         window.mozRequestAnimationFrame ||
         window.oRequestAnimationFrame ||
         window.msRequestAnimationFrame ||
         function(/* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
           window.setTimeout(callback, 1000/60);
         };
})();

function expandCanvas() {
    var canvas = document.getElementById('canvas')
    var newWidth = window.innerWidth
    var newHeight = window.innerHeight
    canvas.width = newWidth
    canvas.height = newHeight
    canvas.style.width = newWidth + 'px'
    canvas.style.height = newHeight + 'px'
    gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;
    render(0)
}

function mvPushMatrix() {
    var copy = mat4.create();
    mat4.set(mvMatrix, copy);
    mvMatrixStack.push(copy);
}

function mvPopMatrix() {
    if (mvMatrixStack.length == 0) {
        throw "Invalid popMatrix!";
    }
    mvMatrix = mvMatrixStack.pop();
}

function setMatrixUniforms() {
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
}

function setMoveUniforms() {
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
}

function createTexture(type, frame, lines) {
    var texture = gl.createTexture();
    texture.image = generateTerminalImage(type, frame, lines)
    texture.image.onload = function () {
        handleLoadedTexture(texture)
    }
    return texture
}

// TODO - remove in final version
function loadTexture(src) {
    var texture = gl.createTexture();
    texture.image = new Image();
    texture.image.onload = function () {
        handleLoadedTexture(texture)
    };
    texture.image.src = src; // setting last to make sure onload would be triggered on all platforms

    return texture
}

// LCG random generator implementation
var _rnd_m = 0xFFFFFFFF, _rnd_a = 1664525, _rnd_c = 1013904223;
var _seed = 1
function rnd() {
    _seed = (_rnd_a * _seed + _rnd_c) % _rnd_m
    return _seed
}

function rndf() {
    return rnd()/_rnd_m
}

function rand(maxValue){
    return rnd()/_rnd_m * maxValue
}

function randi(maxValue){
    return ~~rand(maxValue)
}
/**
 * returns
 * @param values {[]} array of values
 * @param possibilities {number[]} array of possibilities, associated with values
 * @returns {*}
 */
function choseRandom(values, possibilities){
    var sum=0;
    var tmp = [];
    for (k in possibilities){
        sum += possibilities[k];
        tmp.push(sum)
    }
    var v=Math.random() * sum;

    var prev=0;
    for (var k in tmp){
        if (v > prev && v <= tmp[k]) {
            return values[k];
        }
        prev = tmp[k];
    }
}
