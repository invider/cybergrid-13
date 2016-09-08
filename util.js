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

function degToRad(degrees) {
    return degrees * Math.PI / 180;
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
