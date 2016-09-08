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
