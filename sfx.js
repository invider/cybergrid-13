var volume = 0.75
var samples = []

var aux = new (window.AudioContext || window.webkitAudioContext)();
var dt = 1 / aux.sampleRate

// basic oscilators
function saw(t) {
    return t - Math.floor(t)
}
function square(t) {
    return 2 * Math.floor(t) - Math.floor(2 * t) + 1 - 0.5
}
function triangle(t) {
    return 2 * Math.abs(2 * (t - Math.floor(t + 0.5))) - 1
}

function renderNoise(t) {
    if (t < 1) return Math.random()*2 - 1
    return 9
}

function renderPowerUp(t) {
    var f = 100 + t*2000
    var v = square(f * t)

    if (t < 0.1) v *= t/0.1 // attack
    // release
    var r = t-0.2
    if (r > 0) {
        if (r > 0.1) return 9
        v *= 1 - r/0.1
    }
    return v
}

function createSample(fn, f) {
    // render
    var v = 0
    var t = 0
    var rbuf = []
    while(v < 9) {
        v = fn(t, f)
        rbuf.push(v)
        t += dt
    }
    rbuf.pop()

    // create aux buffer and copy rendered data
    var buffer = aux.createBuffer(1, rbuf.length, aux.sampleRate)
    var data = buffer.getChannelData(0);

    for (var i = 0; i < buffer.length; i++) {
        data[i] = rbuf[i]
    }
    return buffer
}

function sfx(sample) {
    var node = aux.createBufferSource()
    var buffer = samples[sample]
    node.buffer = buffer;
    node.connect(aux.destination);
    node.start(0);
    //node.onended = //fn to handle end
}

// careful with looping - schedule only-looping nodes
function loop(sample, time) {
    var node = samples[sample]
    node.connect(aux.destination);
    node.start(0);
    node.stop(aux.currentTime + time)
}

function setupSFX() {
    samples.push(createSample(renderNoise, false))
    samples.push(createSample(renderPowerUp, false))

    sfx(0)
}
