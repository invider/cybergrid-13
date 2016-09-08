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
    render()
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

function initTexture(material) {
    var texture = gl.createTexture();
    texture.image = generateTextureImage(material)
    texture.image.onload = function () {
        handleLoadedTexture(texture)
    };
    return texture
}

function rand(maxValue){
    return Math.random() * maxValue;
}

function randomInt(maxValue){
    return Math.floor(rand(maxValue));
}
