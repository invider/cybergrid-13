function initGL(canvas) {
    try {
        //gl = canvas.getContext("experimental-webgl");
		gl = canvas.getContext("webgl", {
			alpha: false
		});
        expandCanvas()
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
    } catch (e) {
        alert("no webgl!" + e);
    }
}

function start() {
    var canvas = document.getElementById("canvas");
    initGL(canvas);
    initShaders();

    // generate textures
    var lines = initShaders.toString().split(";");

    for (var type = 0; type < 5; type++) {
        textureSets[type] = []
        for (var i = 0; i < lines.length; i++) {
            textureSets[type].push(createTexture(type, i, lines))
        }
    }

    generateWorld();
    gl.clearColor(0.1, 0.0, 0.2, 1.0); // scene background color
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // map event handlers
    window.onkeydown = handleKeyDown;
    window.onkeyup = handleKeyUp;
    window.oncontextmenu = handleMouse;
    window.addEventListener('resize', expandCanvas, false)

    // initiate fm
    setupSFX()
    // initiate main cycle
    cycle();
}
document.addEventListener("DOMContentLoaded", start);

