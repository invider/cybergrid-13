var gl;

// entities
var entities = []
var textureSets = []
var alphaTexture = []

// legacy - need to get rid of those
var blocks = []
var segments = []

var mvMatrix = mat4.create();
var mvMatrixStack = [];

// camera
var pMatrix = mat4.create()

var pitch = 0;
var pitchRate = 0;

var yaw = 0;
var yawRate = 0;

var xPos = 0;
var yPos = 0.5; // player height
var zPos = 0;

var playerSpeed = 0;
var playerRadius = 0.2;

var dashIce = false
var playerIce = 3

// Used to make us "jog" up and down
var joggingShift = 0;

var gameTime = 0
var lastTime = Date.now()
var shaderProgram;

function playerHit(e, delta) {
    if (e.ice && playerIce < 8) {
        playerIce++
        e.alive = false
        sfx(1)
    }
}

function spawn(cons, x, y, z) {
    var entity = new cons()
    entity.initPos(x, y, z)
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
    return entity
}

// spawn a random ice
function ice() {
    var sx = -xPos + rand(20) - 10
    var sz = -zPos + rand(20) - 10
    spawn(Ice, sx, -0.5, sz)
}

// spawn a random signal
function signal() {
    var sx = -xPos
    var sz = -zPos
    var sy = rand(5)-4
    var dx = 0, dz = 0

    switch(randomInt(4)) {
        case 0:
            sx -= 16; sz += rand(8) - 4; dx = 1;
            break;
        case 1:
            sx += 16; sz += rand(8) - 4; dx = -1;
            break;
        case 2:
            sx += rand(8) - 4; sz -= 16; dz = 1;
            break;
        default:
            sx += rand(8) - 4; sz += 16; dz = -1;
            break;
    }
    var s = spawn(Signal, sx, sy, sz)
    sx = 2+rand(6) // reuse sx var
    s.dx = dx*sx
    s.dz = dz*sx
    sx = 0.05 + rand(0.2)
    s.scale = [sx, sx, sx]
    s.textures = textureSets[randomInt(textureSets.length)]
}


function cycle() {
    var now = Date.now()
    var delta = (now - lastTime)/1000
    window.requestAnimFrame(cycle);

    try {
        handleKeyboard(delta);
        update(delta);
        render(delta);
    } catch (e) {
        console.log(e)
    }

    lastTime = now
}

function update(delta) {
    gameTime += delta
    // mode and fiddle camera
    xPos -= Math.sin(yaw) * playerSpeed * delta;
    zPos -= Math.cos(yaw) * playerSpeed * delta;

    if (playerSpeed != 0) {
        joggingShift += delta * 10;
        yPos = Math.sin(joggingShift) / 15 + 0.5
    }

    yaw += yawRate * delta;
    pitch += pitchRate * delta;

    // spawn signals
    if (rand(1) < 4*delta) {
        signal()
    }

    // spawn ice
    if (rand(1) < 1*delta) {
        ice()
    }
}

function render(delta) {
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // set camera view
    mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);
    // reset camera matrix
    mat4.identity(mvMatrix);

    // move to camera view - pitch, yaw, translate
    mat4.rotate(mvMatrix, -pitch, [1, 0, 0]);
    mat4.rotate(mvMatrix, -yaw, [0, 1, 0]);
    mat4.translate(mvMatrix, [-xPos, -yPos, -zPos]);

    // update and render entities
    entities.map( function(e) {
        if (e.alive) {
            // test with camera
            
            if (e.touch) {
                // touchable
                entities.map( function(t) {
                    if (t.solid && e.touch(t.x, t.z, t.radius)) {
                        e.hit(t)
                    }
                })

                if (e.solid) {
                    if (e.touch(-xPos, -zPos, playerRadius)) playerHit(e, delta)
                }
            }

            e.update(delta)
            e.render(delta)
        }
    })

    // reset camera matrix
    mat4.identity(mvMatrix);

    // render dashboard
    if (dashIce) {
        var x = (playerIce-1) * 0.006 + 0.004
        for (var i = 0; i < playerIce; i++) {
            var ice = dashIce[i]
            ice.x = x
            ice.update(delta)
            ice.render(delta)
            x -= 0.012
        }
    }
	//gl.clearColor(1, 1, 1, 1);
	//gl.colorMask(false, false, false, true);
	//gl.clear(gl.COLOR_BUFFER_BIT);
}
