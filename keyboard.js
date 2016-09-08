/**
 * Created by shaddy on 07.09.16.
 */
var keys = {};
function handleKeyDown(e) {
    keys[e.which || e.keyCode] = true;
    e.preventDefault()
    e.stopPropagation()
    return false;
}
function handleKeyUp(e) {
    keys[e.which || e.keyCode] = false;
    e.preventDefault()
    e.stopPropagation()
    return false;
}
function handleMouse(e) {
    e.preventDefault()
    e.stopPropagation()
    return false;
}
function handleKeyboard(delta) {
    if (keys[33]) {
        // Page Up
        pitchRate = 1;
    } else if (keys[34]) {
        // Page Down
        pitchRate = -1;
    } else {
        pitchRate = 0;
    }

    if (keys[37] || keys[65]) {
        // Left cursor key or A
        yawRate = 2;
    } else if (keys[39] || keys[68]) {
        // Right cursor key or D
        yawRate = -2;
    } else {
        yawRate = 0;
    }

    if (keys[38] || keys[87]) {
        // Up cursor key or W
        playerSpeed = 4;
    } else if (keys[40] || keys[83]) {
        // Down cursor key
        playerSpeed = -4;
    } else {
        playerSpeed = 0;
    }
}
