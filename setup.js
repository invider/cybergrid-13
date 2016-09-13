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

function corev() {
    return (0x1000 + randi(0xEFFF)).toString(16).toUpperCase() + ' '
}
function coreDumpLine() {
    return corev() + corev() + corev() + corev()
}

var virusData = [
        ' ', '#', '$', '/', '\\', '^', '!', '~',
        '%', '@', '*', '0', 'F', 'A', '[', ']',
        '|', '<', '>', '.', 'Z', 'X'
]
function virusv() {
    return virusData[randi(virusData.length)]
}
function virusLine() {
    var res = ''
    for (var i = 0; i < 21; i++) {
        res += virusv()
    }
    return res
}

function start() {
    var canvas = document.getElementById("canvas");
    initGL(canvas);
    initShaders();

    // generate textures
    var lines

    for (var type = 0; type < 5; type++) {

        switch(type) {
        case 1: lines = []
            for (var i = 0; i < 15; i++) {
                lines.push(virusLine())
            }
            break;
        case 2: lines = [
                "===  CORE DUMP  ===",
                ]
            for (var i = 0; i < 14; i++) {
                lines.push(coreDumpLine())
            }
            break;
        case 3: lines = [
                "/* GRID SUPERVISOR */",
                "#include <core/irq.h>",
                "#include <kernel.h>",
                "extern struct hw_irq",
                "#define IRQ_DISABLED 2",
                "#define IRQ_PENDING  4",
                "unsigned int flags = 7;",
                "current->priority = 0;",
                "for(;;) {",
                "    if(work) _idle = 1;",
                "    if(intr) break;",
                "}",
                "current->state = HALT;",
                "unlock_core();",
                "queue(SIGKILL);",
                "return -9;",
                ]
                break;
        default: lines = [
                "07BF0: ADD AX, DX",
                "07BF1: INC AX",
                "07BF2: CAD AX, DX",
                "07BF3: LDF AX, DX",
                "07BF4: LDU AX, DX",
                "07BF5: LDC AX, DX",
                "07BF7: JMP 0FFA4",
                "07BF8: LDF AX, DX",
                "07BF9: LDQ AX, DX",
                "07BFA: LDQ AX, DX",
                "07BFB: LDQ AX, DX",
                "07BFC: LDQ AX, DX",
                "07BFD: LDQ AX, DX",
                "#HALT AND CATCH FIRE#",
            ]
        }
        
        textureSets[type] = []
        for (var i = 0; i < lines.length; i++) {
            textureSets[type].push(createTexture(type, i, lines))
        }
    }

    setupSFX()
    generateWorld();

    // setup gl
    gl.clearColor(0.07, 0.0, 0.15, 1.0); // scene background color
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // map event handlers
    window.onkeydown = handleKeyDown;
    window.onkeyup = handleKeyUp;
    window.oncontextmenu = handleMouse;
    window.addEventListener('resize', expandCanvas, false)

    // initiate main cycle
    cycle();
}
document.addEventListener("DOMContentLoaded", start);

