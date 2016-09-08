function initGL(canvas) {
    try {
        gl = canvas.getContext("experimental-webgl");
        expandCanvas()
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
    } catch (e) {
        alert("no webgl!");
    }
}

function start() {
    var canvas = document.getElementById("canvas");
    initGL(canvas);
    initShaders();

    // generate textures
    var lines = initShaders.toString().split(";");
    mudTexture = createTexture(0, 0, lines);

    for (var type = 0; type < 5; type++) {
        textureSets[type] = []
        for (var i = 0; i < lines.length; i++) {
            textureSets[type].push(createTexture(type, i, lines))
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

