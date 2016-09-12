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

/*
// alien phone
f: function (n) {
    var v = Math.sin(P2 * n.f * n.t
            + 1 * Math.sin(P2 * (n.f / 16) * n.t));

    if (n.t < 0.2) v *= n.t/0.2 // attack

    var r = n.t - 1
    if (r > 0) {
        if (r >= 1) { n.s = 2; return 0; }
        v *= 1 - r
    }
    return v



n: 'tow',
f: function (n) {
    var v = Math.sin(P2 * n.f * n.t + (n.t-0.5)/0.5 * 20
            * Math.sin(P2 * (n.f/4) * n.t))
    if (n.t < 0.5) v *= n.t/0.5
    if (n.s > 0) {
        if (n.r > 1) { n.s = 2; return 0 }
        v *= 1 - n.r
    }
    return v
}},

// wooden tremble
f: function (n) {
    var v = Math.sin(
            P2 * n.f * n.t
            + 4 * Math.sin(P2 * (n.f / 4) * n.t
                + 8 * Math.sin(P2 * n.f * n.t/16))
            + 0.3 * saw(n.f * n.t)
            )

    if (n.t < 0.2) v *= n.t/0.2 // attack

    var r = n.t - 1
    if (r > 0) {
        if (r >= 1) { n.s = 2; return 0; }
        v *= 1 - r
    }
    return v
}},


n: 'pewee',
f: function (n) {
    var f = n.f + 1000 - n.t*2000
    var v = triangle(f * n.t)

    if (n.t < 0.1) v *= n.t/0.1 // attack

    var r = n.t - 0.5
    if (r > 0) {
        if (r >= 0.5) { n.s = 2; return 0; }
        v *= 0.5 - r
    }
    return v
}},


n: 'pew',
f: function (n) {
    var f = n.f + 900 - n.t*1200
    var v = triangle(f * n.t)

    if (n.t < 0.1) v *= n.t/0.1 // attack

    var r = n.t - 0.4
    if (r > 0) {
        if (r >= 0.2) { n.s = 2; return 0; }
        v *= 1 - r/0.2
    }
    return v
}},
{
n: 'laser',
f: function (n) {
    var f = n.f + 1000 - n.t*1800
    var v = saw(f * n.t)

    if (n.t < 0.1) v *= n.t/0.1 // attack

    var r = n.t - 0.3
    if (r > 0) {
        if (r >= 0.1) { n.s = 2; return 0; }
        v *= 1 - r/0.1
    }
    return v
}},

{
n: 'laser-2',
f: function (n) {
    var f = n.f + 1000 - n.t*1800
    var v = 
        0.2 * square(f * n.t)
        0.4 * Math.random()
        0.4 * Math.sin(P2 * n.f * n.t)

    if (n.t < 0.1) v *= n.t/0.1 // attack

    var r = n.t - 0.3
    if (r > 0) {
        if (r >= 0.1) { n.s = 2; return 0; }
        v *= 1 - r/0.1
    }
    return v
}},
{
n: 'drone',
f: function (n) {
    var f = 120
    var v = envacr(n.t, 0.3, 0.8, 0.3, 0.6, 0.5, 2) * square(
            f * n.t
            + 4*envc(n.t, 1, 0.6) * Math.sin(P2 * f/4 * n.t)
            + Math.sin(P2 * f*2 * n.t)
            )

    // sustain
    if (n.s > 0) {
        if (n.r > 0.2) { n.s = 2; return 0 } // kill note
        v *= envr(n.r, 0.2) // release
    }
    return v
}},
///////////////////////////////////////////////////////////

*/

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
