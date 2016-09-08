'use strict'

var gl;
var segments = []
var mudTexture;
var wallTexture = []


var mvMatrix = mat4.create();
var mvMatrixStack = [];
var pMatrix = mat4.create();

var pitch = 0;
var pitchRate = 0;

var yaw = 0;
var yawRate = 0;

var xPos = 0;
var yPos = 0.4;
var zPos = 0;

var speed = 0;

var worldVertexPositionBuffer = null;
var worldVertexTextureCoordBuffer = null;
var lastFrame = Date.now()
var shaderProgram;

function start() {
    var canvas = document.getElementById("canvas");
    initGL(canvas);
    initShaders();

    // generate textures
    var lines = initShaders.toString().split(";");
    mudTexture = createTexture(0, 0, lines);

    for (var type = 0; type < 5; type++) {
        wallTexture[type] = []
        for (var i = 0; i < lines.length; i++) {
            wallTexture[type].push(createTexture(type, i, lines))
        }
    }

    generateWorld();
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    window.onkeydown = handleKeyDown;
    window.onkeyup = handleKeyUp;
    window.oncontextmenu = handleMouse;
    window.addEventListener('resize', expandCanvas, false)
    cycle();
}
document.addEventListener("DOMContentLoaded", start);


var blocks = []
function render(delta) {
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);

    mat4.identity(mvMatrix);

    // move to camera view - pitch, yaw, translate
    mat4.rotate(mvMatrix, degToRad(-pitch), [1, 0, 0]);
    mat4.rotate(mvMatrix, degToRad(-yaw), [0, 1, 0]);
    mat4.translate(mvMatrix, [-xPos, -yPos, -zPos]);


    // render walls
    //gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.GL_BLEND);
    gl.blendFunc(gl.GL_SRC_ALPHA, gl.GL_ONE_MINUS_SRC_ALPHA);
    //gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    //gl.blendFunc(gl.ONE, gl.ONE);
    //gl.blendFunc(gl.ONE, gl.GL_ONE_MINUS_SRC_ALPHA);

    segments.map( function(s) {
        s.render(delta)
    })

    // render objects
    objects.map( function(o) {
        o.render(delta)
    })
}


var lastTime = 0;
// Used to make us "jog" up and down as we move forward.
var joggingAngle = 0;

function update() {
    var timeNow = new Date().getTime();
    if (lastTime != 0) {
        var elapsed = timeNow - lastTime;

        if (speed != 0) {
            xPos -= Math.sin(degToRad(yaw)) * speed * elapsed;
            zPos -= Math.cos(degToRad(yaw)) * speed * elapsed;

            joggingAngle += elapsed * 0.6; // 0.6 "fiddle factor" - makes it feel more realistic :-)
            yPos = Math.sin(degToRad(joggingAngle)) / 20 + 0.4
        }

        yaw += yawRate * elapsed;
        pitch += pitchRate * elapsed;

    }
    lastTime = timeNow;
}

function cycle() {
    var now = Date.now()
    var delta = (now - lastFrame)/1000
    window.requestAnimFrame(cycle);
    handleKeyboard(delta);
    update(delta);
    render(delta);

    lastFrame = now
}


