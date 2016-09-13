var volume = 0.75
var samples = []
var P2 = Math.PI*2

var aux = new (window.AudioContext || window.webkitAudioContext)();
var dt = 1 / aux.sampleRate

// basic oscilators
function saw(t) {
    return t - Math.floor(t) - 0.5
}
function square(t) {
    return 2 * Math.floor(t) - Math.floor(2 * t) + 0.5
}
function triangle(t) {
    return 2 * Math.abs(2 * (t - Math.floor(t + 0.5))) - 1
}
function pulse(t) {
    return 2 * Math.floor(t) - Math.floor(2 * t) + 1
}

// envelopes
function enva(t, a, al) {
    if (t < a) return al*t/a // atack
    return al
}
function envda(t, d, a, al) {
    if (t < d) return 0 // delay
    if (t < d + a) return al*((t-d)/a) // atack
    return al
}
function envac(t, a, al, c, sl) {
    if (t < a) return al*(t/a) // atack
    if (t < a + c) return sl + (al-sl)*(1 - (t-a)/c) // decay
    return sl
}
function envdac(t, d, a, al, c, sl) {
    if (t < d) return 0 // delay
    if (t < d + a) return al*((t-d)/a) // atack
    if (t < d + a + c) return sl + (al-sl)*(1 - (t-d-a)/c) // decay
    return sl
}
function envacr(t, a, al, c, sl, s, r) {
    if (t < a) return al*(t/a) // atack
    if (t < a + c) return sl + (al-sl)*(1 - (t-a)/c) // decay
    if (t < a + c + s) return sl // sustain
    if (t < a + c + s + r) return sl*(1 - (t-a-c-s)/r) // release
    return 0
}
function envdacr(t, d, a, al, c, sl, s, r) {
    if (t < d) return 0 // delay
    if (t < d + a) return al*((t-d)/a) // atack
    if (t < d + a + c) return sl + (al-sl)*(1 - (t-d-a)/c) // decay
    if (t < d + a + c + s) return sl // sustain
    if (t < d + a + c + s + r) sl*(1 - (t-d-a-c-s)/r) // release
    return 0
}
function envc(t, c, sl) {
    if (t < c) return sl + (1-sl) * (1-t/c) // decay
    return sl
}
function envdc(t, d, c, sl) {
    if (t < d) return 1
    if (t < d + c) sl + (1-sl)*(1 - (t-d)/c) // decay
    return sl
}
function envr(t, r) {
    if (t < r) return 1 - t/r // release
    return 0
}


function renderNoise(t) {
    if (t < 1) return envacr(t, 0.3, 1, 0, 1, 0.5, 0.3) * Math.random()*2 - 1
    return 9
}

function renderShortNoise(t) {
    if (t < 0.5) return envacr(t, 0.05, 0.2, 0, 0.2, 0.3, 0.1) * (
            Math.random()*2
            + triangle(t))
    return 9
}

function renderSpawn(t, f) {
    var v = envacr(t, 0.05, 0.6, 0.1, 0.4, 0.1, 0.1) * square(
            f * t
            + 4*envc(t, 1, 0.6) * Math.sin(P2 * f/4 * t)
            + Math.sin(P2 * f*2 * t)
    )

    if (t > 0.4) return 9
    return v * 0.05
}


function renderAlienPhone(t, f) {
    var v = Math.sin(P2 * f * t
            + 1 * Math.sin(P2 * (f / 16) * t));
    if (t < 0.2) v *= t/0.2 // attack

    var r = t - 1
    if (r > 0) {
        if (r >= 1) return 9;
        v *= 1 - r
    }
    return v
}

function renderDrone(t) {
    var f = 120
    var v = envacr(t, 0.3, 0.8, 0.3, 0.6, 0.5, 2) * square(
            f * t
            + 4*envc(t, 1, 0.6) * Math.sin(P2 * f/4 * t)
            + Math.sin(P2 * f*2 * t)
    )

    var r = t - 2
    // sustain
    if (r > 0) {
        if (r > 0.2) { return 9 } // kill note
        v *= envr(r, 0.2) // release
    }
    return v * 0.2
}

function renderDrone2(t) {
    var f = 120
    var v = envacr(t, 0.3, 0.8, 0.3, 0.6, 0.5, 2) * square(
            f * t
            + 4*enva(t, 1.7, 0.8) * Math.sin(P2 * f/4 * t)
            + Math.sin(P2 * f*2 * t)
    )

    var r = t - 2
    // sustain
    if (r > 0) {
        if (r > 0.2) { return 9 } // kill note
        v *= envr(r, 0.2) // release
    }
    return v * 0.2
}

function renderDrone3(t) {
    var f = 120
    var v = envacr(t, 0.3, 0.8, 0.3, 0.6, 0.5, 2) * square(
            f * t
            + 32*enva(t, 0.7, 0.8) * Math.sin(P2 * f/4 * t)
            + 16*envda(t, 1.5, 0.2, 0.8) * Math.sin(P2 * f/4 * t)
            + Math.sin(P2 * f*2 * t)
    )

    var r = t - 2
    // sustain
    if (r > 0) {
        if (r > 0.2) { return 9 } // kill note
        v *= envr(r, 0.2) // release
    }
    return v * 0.2
}

function renderPew(t) {
    var f = 1000 - t*2000
    var v = triangle(f * t)

    if (t < 0.1) v *= t/0.1 // attack

    var r = t - 0.2
    if (r > 0) {
        if (r >= 0.2) return 9
        v *= 1 - r/0.2
    }
    return v * 0.5
}


/*

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

function renderCoin(t, f) {
    if (t < 0.2) f = f * 1.5
    var v =
        0.1 * square(f * t)
        + 0.4 * triangle(f * t)
        + 0.4 * Math.sin(P2 * f * t)

    if (t < 0.1) v *= t/0.1 // attack

    var r = t - 0.3
    if (r > 0) {
        if (r >= 0.1) return 9;
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
    samples.push(createSample(renderSpawn, 120)) 
    samples.push(createSample(renderCoin, 200)) // 1 pick up
    samples.push(createSample(renderDrone2, false)) // 2 shoot
    samples.push(createSample(renderDrone3, false)) // 3 infection
    samples.push(createSample(renderPew, false)) // 4 cure
    samples.push(createSample(renderShortNoise, false)) // 5 inf cure
    samples.push(createSample(renderDrone2, false)) // 6 chain
    samples.push(createSample(renderDrone3, false)) // 7 iceless
    samples.push(createSample(renderDrone3, false)) // 8 term iceless
    samples.push(createSample(renderAlienPhone, 220)) // 9 new level
    samples.push(createSample(renderSpawn, 110)) // 10 virus spawned
    samples.push(createSample(renderSpawn, 220)) // 11 ice spawned

}
