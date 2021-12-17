var game = new GameCore(), gameCompents = game.build(), canvas = gameCompents.canvas,
    ctx = gameCompents.ctx

document.querySelector('body').appendChild(canvas)

var center = {
    x:  canvas.width / 2,
    y:  canvas.height /2
}

function drawArena() {
    var
        polygonPadding = canvas.width / 15,
        borderOffset = canvas.height / 4.5,
        polygonTop = {
            x: canvas.width / 2,
            y: polygonPadding
        },
        polygonBottom = {
            x : canvas.width / 2,
            y: canvas.height - polygonPadding
        },
        leftBorderTop = {
            x : polygonPadding,
            y : borderOffset
        },
        leftBorderBottom = {
            x : polygonPadding,
            y : canvas.height - borderOffset
        },
        rigthBorderTop = {
            x : canvas.width - polygonPadding,
            y : borderOffset
        },
        rightBordeBottom = {
            x : canvas.width - polygonPadding,
            y : canvas.height - borderOffset
        },

        polygonsPoints = [
            polygonTop, leftBorderTop, leftBorderBottom,
            polygonBottom, rightBordeBottom , rigthBorderTop
        ]

    ctx.beginPath()
    polygonsPoints.forEach( function (point, i) {
        i == 0 ? ctx.moveTo( point.x, point.y ): ctx.lineTo( point.x, point.y )
    } )


    ctx.fillStyle = terrainPattern;
    ctx.fill();
}

var mouse = {
    x : canvas.width / 2,
    y : canvas.height /2
}


window.onmousemove = function( event ) {
    var offsetTop = event.target.offsetTop,
        offsetLeft = event.target.offsetLeft,
        positionY = event.pageY - offsetTop,
        positionX = event.pageX - offsetLeft

    mouse.x = positionX
    mouse.y = positionY
}

var lastTime
function main() {
    var now = Date.now();
    var dt = (now - lastTime) / 1000.0

    render()
    lastTime = now
    requestAnimationFrame(main)
}


function init() {
    terrainPattern = ctx.createPattern(resources.get( '/static/img/bitum.png' ), 'repeat')
    lavaPattern = ctx.createPattern(resources.get( '/static/img/lava.png' ), 'repeat')

    lastTime = Date.now()
    main()
}

var warlock = function (x, y) {
    this.x = x
    this.y = y
}

var Vector = function(x, y) {
    this.x = x
    this.y = y
}

Vector.prototype = {
    add: function (v) {
        return new Vector(this.x + v.x, this.y + v.y)
    },

    substract: function (v) {
        return new Vector(this.x - v.x, this.y - v.y)
    },

    normalize: function(l) {
        return new Vector(this.x / l, this.y / l)
    }
}

warlock.prototype = {
    draw: function () {
        if (this.direction) {
            var speed = {
                x: this.direction.x - this.x,
                y: this.direction.y - this.y
            }

            var length = Math.sqrt(Math.pow(speed.x, 2) + Math.pow(speed.y, 2))

            if (length > 3 ) {
                this.x += speed.x * 4 / length 
                this.y += speed.y * 4 / length
            }
        }

        ctx.fillStyle = 'red'
        ctx.beginPath();
        ctx.arc(this.x, this.y, 25, 0, 2 * Math.PI);
        ctx.fill();
    }
}

//HEPLERS
window.onmousedown = function ( e ) {
    if( e.target === canvas ) {
        var player = warlocks[0]
        player.direction = {
            x: mouse.x,
            y: mouse.y
        }
    }
}


warlocks = []
warlocks.push(new warlock(canvas.width / 3, canvas.height / 4))


function render() {
    ctx.fillStyle = terrainPattern
    ctx.fillStyle = lavaPattern
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    drawArena()
    warlocks.forEach(function(w) {
        w.draw()
    })
};


window.onload = function() {
    resources.load([
        '/static/img/bitum.png',
        '/static/img/lava.png',
        '/static/img/warlock.jpg',
        '/static/img/fireball.png'
    ]);
    resources.onReady(init);
}
