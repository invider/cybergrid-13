'use strict'

function generateTerminalImage(type, frame, lines) {
    var width = 256
    var height = 256
    var tcanvas = document.createElement("canvas");

    tcanvas.width = width
    tcanvas.height = height
    var context = tcanvas.getContext("2d");

    drawFrame(context, type, frame, lines)

    var textureImgData = tcanvas.toDataURL("image/png");
    var image = new Image()
    image.src = textureImgData

    return image

    function drawFrame(ctx, type, frame, lines){
        ctx.fillStyle="#000000";
        ctx.fillRect(0,0,width,height); 

        var cl = '#888888'
        switch(type) {
        case 0: cl ='#00E0FF'; break;
        case 1: cl ='#FF0020'; break;
        case 2: cl ='#20FF00'; break;
        case 3: cl ='#FFFF00'; break;
        case 4: cl ='#FFFFFF'; break;
        }

        // text
        var vsh = 17
        ctx.fillStyle = cl
        ctx.font="17px 'Lucida Console', Monaco, monospace";

        while (vsh < height) {
            if (frame >= lines.length) frame = 0;
            ctx.fillText(lines[frame++],20,vsh); 
            vsh += 18
        }

        scanlines(ctx)

        // outer frame
        ctx.strokeStyle=cl
        ctx.lineWidth="4";
        ln(ctx, 0, 0, width, 0)
        ln(ctx, 0, 0, 0, height)
        ln(ctx, width, 0, width, height)
        ln(ctx, 0, height, width, height)
    }

    function scanlines(ctx) {
        context.lineWidth="2";
        context.strokeStyle = "rgba(0, 0, 0, 0.7)";
        for (var i = 0; i < height/4; i++) {
            ln(ctx, 0, i*4, width, i*4)
        }
    }

    function ln(ctx, x1, y1, x2, y2) {
        ctx.beginPath();
        ctx.moveTo(x1,y1);
        ctx.lineTo(x2,y2);
        ctx.stroke(); 
    }
}

function generateTextureImage(material) {
    var width = 256
    var height = 256
    var tcanvas = document.createElement("canvas");
    //var tcanvas = document.getElementById("tcanvas");

    tcanvas.width = width
    tcanvas.height = height
    //tcanvas.style = "background:transparent;"
    var context = tcanvas.getContext("2d");

    switch(material) {
        case 0: drawTerm(context);
                break;
        case 1: drawPerlin(context, 40, 175, 0, 0, 0)
                break;
        case 2: drawPerlin(context, 40, 175, 100, 100, 100)
                break;
        case 3: drawPerlin(context, 40, 175, 100, 60, 20)
                break;
        case 4: drawPerlin(context, 30, 150, 20, 40, 0)
                break;
        case 5: drawPerlin(context, 20, 200, 70, 0, 0)
                context.strokeStyle="#601010";
                context.lineWidth="3";
                drawBricks(context)
                break;
        case 6: drawPerlin(context, 20, 200, 60, 60, 60)
                context.strokeStyle="#303030";
                context.lineWidth="3";
                drawBricks(context)
                break;
        case 7: drawPerlin(context, 20, 200, 0, 70, 0)
                context.strokeStyle="#003000";
                context.lineWidth="3";
                drawBricks(context)
                break;
        case 8: drawPerlin(context, 20, 200, 20, 20, 40)
                context.strokeStyle="#101015";
                context.lineWidth="3";
                drawBricks(context)
                break;
        case 9: drawPerlin(context, 20, 200, 70, 70, 10)
                context.strokeStyle="#101015";
                context.lineWidth="3";
                drawBricks(context)
                break;
        case 10:drawGradient(context)
                context.strokeStyle="#101015";
                context.lineWidth="3";
                drawBricks(context)
                break;
        default: drawNoise(context)
    }
    //drawNoise(context)
    //drawPerlin(context, 40, 175)
    //drawP2(context, 40, 180)
    //drawP3(context, 40, 180)
    //drawP4(context, 40, 180)
    //drawP5(context, 40, 180)
    //drawGradient(context)

    var textureImgData = tcanvas.toDataURL("image/png");
    var image = new Image()
    image.src = textureImgData

    //var tdata = tcanvas.toDataURL("image/png");
    //var debug = document.getElementById('debug')
    //debug.innerHTML += '<img src="' + tdata + '" />'

    return image

    function drawTerm(ctx){
        ctx.fillStyle="#000000";
        ctx.fillRect(0,0,width,height); 

        context.strokeStyle="#2020EE";
        context.lineWidth="8";
        ln(ctx, 0, 0, width, 0)
        ln(ctx, 0, 0, 0, height)
        ln(ctx, width, 0, width, height)
        ln(ctx, 0, height, width, height)
        
        var vsh = 20
        ctx.font="14px 'Lucida Console', Monaco, monospace";
        tx(ctx, 20, vsh, 'DATA INFO')
        vsh += 20
        tx(ctx, 20, vsh, 'LD AR, BR')
        vsh += 20
        tx(ctx, 20, vsh, '#FFAADD')
        vsh += 20
        tx(ctx, 20, vsh, '// information')
        vsh += 20
        tx(ctx, 20, vsh, '#include something')
        vsh += 20
        tx(ctx, 20, vsh, 'GARBAGE')
        vsh += 20
        tx(ctx, 20, vsh, '>> bash')
        vsh += 20
        tx(ctx, 20, vsh, 'TST LD, MD')
        vsh += 20
        tx(ctx, 20, vsh, '// information')
        vsh += 20
        tx(ctx, 20, vsh, '$ SYSTEM SHELL')
    }

    function tx(ctx, x, y, text) {
        var gradient=ctx.createLinearGradient(0,0,width,0);
        gradient.addColorStop("0","#0000FF");
        gradient.addColorStop("0.5","#8040FF");
        gradient.addColorStop("1.0","#9000FF");
        ctx.fillStyle=gradient;
        ctx.fillText(text,x,y); 
    }

    function drawBricks(ctx) {
        ln(ctx, 0, height/6, width, height/6)
        ln(ctx, 0, height/6*2, width, height/6*2)
        ln(ctx, 0, height/6*3, width, height/6*3)
        ln(ctx, 0, height/6*4, width, height/6*4)
        ln(ctx, 0, height/6*5, width, height/6*5)

        ln(ctx, width/2, 0, width/2, height/6)
        ln(ctx, width/2, height/6*2, width/2, height/6*3)
        ln(ctx, width/2, height/6*4, width/2, height/6*5)

        ln(ctx, width/4, height/6, width/4, height/6*2)
        ln(ctx, width - width/4, height/6, width-width/4, height/6*2)
        ln(ctx, width/4, height/6*3, width/4, height/6*4)
        ln(ctx, width - width/4, height/6*3, width-width/4, height/6*4)
        ln(ctx, width/4, height/6*5, width/4, height)
        ln(ctx, width - width/4, height/6*5, width-width/4, height)
    }

    function ln(ctx, x1, y1, x2, y2) {
        ctx.beginPath();
        ctx.moveTo(x1,y1);
        ctx.lineTo(x2,y2);
        ctx.stroke(); 
    } 

    function drawNoise(ctx) {
        for (var x = 0; x < width; x++) {
            for (var y = 0; y < height; y++) {
                var r = Math.floor(Math.random() * 256)
                var g = Math.floor(Math.random() * 256)
                var b = Math.floor(Math.random() * 256)
                var rgb = '#' + r.toString(16) + g.toString(16) + b.toString(16)
                pixel(ctx, x, y, rgb)
            }
        }
    }

    function pixel(ctx, x, y, c) {
        ctx.fillStyle = c
        ctx.fillRect(x, y, 1 ,1)
    }

    function drawGradient(ctx) {
      var cxlg=ctx.createLinearGradient(0, 0, width, 0);
      cxlg.addColorStop(0, '#f00');
      cxlg.addColorStop(0.5, '#0f0');
      cxlg.addColorStop(1.0, '#00f');

      ctx.fillStyle = cxlg;
      ctx.fillRect(0,0,width,height);
    }

    function drawP5(ctx, waterLevel, mountainLevel) {
        var perlin = genPerlin(ctx, width*2, waterLevel, mountainLevel)

        for (var x = 0; x < width; x++) {
            for (var y = 0; y < height; y++) {
                var n = perlin[x][y]
                var b = 255 - 255*(1+Math.sin(n+6.3*x))/2;
                var g = 255 - 255*(1+Math.cos(n+6.3*x))/2;
                var r = 255 - 255*(1-Math.sin(n+6.3*x))/2;

                //pixel(ctx, x, y, 'rgb('+r+','+g+','+b+')');
                pixel(ctx, x, y, 'rgb('+n+','+n+','+n+')');
            }
        }
    }
    
    function drawP4(ctx, waterLevel, mountainLevel) {
        var perlin = genPerlin(ctx, width*2, waterLevel, mountainLevel)

        for (var x = 0; x < width; x++) {
            for (var y = 0; y < height; y++) {
                var n=perlin[x][y]
                //var x /= w;
                //var y /= h; sizex = 1.5; sizey=10;
                //x = (1+Math.cos(n+2*Math.PI*x-.5));
                //x = Math.sqrt(x); y *= y;
                var r= 255-x*255;
                var g=255-n*x*255
                var b=y*255;
                pixel(ctx, x, y, 'rgb('+r+','+g+','+b+')');
            }
        }
    }

    function drawP3(ctx, waterLevel, mountainLevel) {
        var perlin = genPerlin(ctx, width*2, waterLevel, mountainLevel)

        for (var x = 0; x < width; x++) {
            for (var y = 0; y < height; y++) {
                var n = perlin[x][y]
                n = Math.cos( n * 85);
                var r = Math.round(n * 255);
                var b = 255 - r; 
                var g = r - 255 ;
                pixel(ctx, x, y, 'rgb('+r+','+g+','+b+')');
            }
        }
    }

    function drawP2(ctx, waterLevel, mountainLevel) {

        var perlin = genPerlin(ctx, width*2, waterLevel, mountainLevel)

        for (var x = 0; x < width; x++) {
            for (var y = 0; y < height; y++) {
                var centerx = width/2;
                var centery = height/2;
                var dx = x - centerx;
                var dy = y - centery;
                var dist = (dx*dx + dy*dy)/6000;
                var n = Math.round(perlin[x][y])
                var r = 255 - dist*Math.round(255*n);
                var g = r - 255;
                var b = 0;
                pixel(ctx, x, y, 'rgb('+r+','+g+','+b+')');
                //pixel(ctx, x,y, 'rgb('+(perlin[x][y]+100)+','+ (perlin[x][y]+50) +','+ (perlin[x][y]+20)+')');
            }
        }
    }

    function drawPerlin(ctx, waterLevel, mountainLevel, rc, gc, bc) {
        var perlin = genPerlin(ctx, width*2, waterLevel, mountainLevel)

        for (var x = 0; x < width; x++) {
            for (var y = 0; y < height; y++) {
                //if (perlin[x][y] <= waterLevel) {
                //    pixel(ctx, x,y, '#6fb4db'); //water
                //} else {
                    pixel(ctx, x,y, 'rgb('+(perlin[x][y]+rc)+','+ (perlin[x][y]+gc) +','+ (perlin[x][y]+bc)+')');
                //}
            }
        }
    }

    function genPerlin(ctx, mapSize, waterLevel, mountainLevel) {
        var offscreen_id = ctx.getImageData(0, 0, width, height);
        var offscreen_pixels = offscreen_id.data;
        var i;
        
        for (var i = 0; i < offscreen_pixels.length; i++) {
            offscreen_pixels[i    ] = 
            offscreen_pixels[i + 1] = 
            offscreen_pixels[i + 2] = Math.floor (Math.random () * 128);
            offscreen_pixels[i + 3] = 255;
        }
        
        var rows=0;
        var perlin = new Array(mapSize);
        var curRow = 0;
                    
        for (var j = 0; j < offscreen_pixels.length; j++) {
            if ( j === 0 || j % mapSize === 0 ){
                perlin[rows] = [];
                curRow=rows;
                rows++;
            }
            perlin[curRow].push(offscreen_pixels[j]);
        }
        
        for (var z = 0; z < perlin.length; z++) {
            perlin[0][0] = 0;
            perlin[z][0] = 0;
            perlin[0][z] = 0;
            perlin[perlin.length-1][z] = 0;
            perlin[z][perlin.length-2] = 0;
        }

        var p1,p2,p3,p4,p5,p6,p7,p8,p9;
        for (var x = 0; x < perlin.length; x++) {
            for (var y = 0; y < perlin[x].length; y++) {
            
                if (x-1 > 0 && y-1 > 0) { p1 = perlin[x-1][y-1]; } else { p1 = 0; }
                if (y-1 > 0) { p2 = perlin[x][y-1]; } else { p2 = 0; }
                if (x+1 < perlin.length && y-1 > 0) { p3 = perlin[x+1][y-1]; } else { p3 = 0; }
                if (x-1 > 0) { p4 = perlin[x-1][y]; } else { p4 = 0; }
                if (x+1 < perlin.length) { p5 = perlin[x+1][y]; } else { p5 = 0; }
                if (x-1 > 0 && y+1 < perlin.length) { p6 = perlin[x-1][y+1]; } else { p6 = 0; }
                if (x+1 < perlin.length) { p7 = perlin[x+1][y]; } else { p7 = 0; }
                if (x-1 > 0 && y+1 < perlin.length) { p8 = perlin[x-1][y+1]; } else { p8 = 0; }
                p9 = perlin[x][y];
                
                var avg = parseInt((p1 + p2 + p3 + p4 + p5 + p6 + p7 + p8 + p9)/9, 10);
                
                if (avg <= waterLevel) { //water
                    avg = 0;
                }
                if (avg > mountainLevel) { //mountains
                    avg = 255;
                }
                perlin[x][y] = avg;
            }
        }
        
        var xx, yy;
        for (xx = 1; xx < perlin.length-1; xx++) {
            for (yy = 1; yy < perlin.length-1; yy++) {
                if (perlin[xx-1][yy] === 0 && perlin[xx+1][yy] === 0 && perlin[xx][yy-1] === 0 && perlin[xx][yy+1] === 0) {
                    perlin[xx][yy] = 0;
                }
                if (perlin[xx-1][yy] === 0 && perlin[xx+1][yy] === 0 && perlin[xx][yy-1] === 0 && perlin[xx][yy+1] === 0) {
                    perlin[xx][yy] = 0;
                }
            }
        }

        return perlin
    }

    // function drawCircle(ctx) {
    //     var centerX = 70;
    //     var centerY = 70;
    //     var radius = 70;
    //
    //     ctx.beginPath();
    //     ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    //
    //     ctx.fillStyle = "#8ED6FF";
    //     ctx.fill();
    //     ctx.lineWidth = 5;
    //     ctx.strokeStyle = "black";
    //     ctx.stroke();
    // }
}

