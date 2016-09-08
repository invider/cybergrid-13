var gl;

// entities
var entities = []
var blocks = []
var segments = []
var textureSets = []

var mvMatrix = mat4.create();
var mvMatrixStack = [];

// camera
var pMatrix = mat4.create();

var pitch = 0;
var pitchRate = 0;

var yaw = 0;
var yawRate = 0;

var xPos = 0;
var yPos = 0.5; // player height
var zPos = 0;

var playerSpeed = 0;

// Used to make us "jog" up and down
var joggingShift = 0;

var lastTime = Date.now()
var shaderProgram;

function spawn(entity) {
    entity.init()

    var placed = false
    for (var i = 0; i < entities.length; i++) {
        if (!entities[i].alive) {
            entities[i] = entity
            placed = true
            break
        }
    }
    if (!placed) entities.push(entity)
}


function cycle() {
    var now = Date.now()
    var delta = (now - lastTime)/1000
    window.requestAnimFrame(cycle);
    handleKeyboard(delta);
    update(delta);
    render(delta);

    lastTime = now
}

function update(delta) {
    // mode and fiddle camera
    xPos -= Math.sin(yaw) * playerSpeed * delta;
    zPos -= Math.cos(yaw) * playerSpeed * delta;

    if (playerSpeed != 0) {
        joggingShift += delta * 10;
        yPos = Math.sin(joggingShift) / 15 + 0.5
    }

    yaw += yawRate * delta;
    pitch += pitchRate * delta;
}

function render(delta) {
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // set camera view
    mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);
    // reset model movement matrix
    mat4.identity(mvMatrix);

    // move to camera view - pitch, yaw, translate
    mat4.rotate(mvMatrix, -pitch, [1, 0, 0]);
    mat4.rotate(mvMatrix, -yaw, [0, 1, 0]);
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

    // update and render entities
    entities.map( function(e) {
        if (e.alive) e.render(delta)
    })
}

