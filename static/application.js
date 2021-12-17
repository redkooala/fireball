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
    polygonsPoints.forEach(function (point, i) {
        i == 0 ? ctx.moveTo( point.x, point.y ): ctx.lineTo( point.x, point.y )
    } )


    ctx.fillStyle = terrainPattern;
    ctx.fill();
}

var mouse = {
    x : canvas.width / 2,
    y : canvas.height /2
}


window.onmousemove = function(event) {
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

var Warlock = function (x, y) {
   this.positioinV = new Vector2d(x, y)
   this.speedV = new Vector2d(x, y)
   this.directionV = new Vector2d(x, y)
   this.SPEED = 4
}

var Vector2d = function(x, y) {
    this.x = x
    this.y = y
}

Vector2d.prototype = {
    add: function (v) {
        return new Vector2d(this.x + v.x, this.y + v.y)
    },

    substract: function (v) {
        return new Vector2d(this.x - v.x, this.y - v.y)
    },

    normalize: function() {
        len = this.len()

        return new Vector2d((this.x / len), (this.y / len))
    },

    len: function() {
        var l = Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2))

        return l
    },

    isEq: function(v) {
        return v.x === this.x && v.y === this.y
    },

    multipleScalar: function (value) {
        return new Vector2d(this.x * value, this.y * value)
    },

    isEqCollision: function(v, collisionValue) {
        return Math.abs(this.x - v.x) < collisionValue && Math.abs(this.y - v.y) < collisionValue
    }
}

Warlock.prototype = {
    draw: function () {
        if (!this.positioinV.isEqCollision(this.speedV, this.SPEED)) {
            this.directionV = this.speedV.substract(this.positioinV).normalize().multipleScalar(this.SPEED)
            this.positioinV = this.positioinV.add(this.directionV)
        }
        var x = this.positioinV.x
        var y = this.positioinV.y
        ctx.fillStyle = 'orange'
        ctx.beginPath()
        ctx.lineJoin = 'round'
        ctx.strockStyle = 'black'
        ctx.moveTo(x, y)
        ctx.lineTo(x + 100, y + 40)
        ctx.lineTo(x + 100, y - 40)
        ctx.lineTo(x, y)
        ctx.lineWidth = 6
        ctx.stroke()

        ctx.fill()
        ctx.beginPath()
        ctx.fillStyle = 'black'
        ctx.font = '14pt Calibri';
        ctx.textAlign = 'left';
        ctx.lineWidth = 15
        ctx.textBaseline = "bottom"
        ctx.fillText('OrgangeSan', x + 104, y);
        ctx.restore()
    }
}

//HEPLERS
window.onmousedown = function (e) {
    if(e.target === canvas) {
        var player = warlocks[0]
        player.speedV = new Vector2d(mouse.x - 50, mouse.y)
    }
}

warlocks = []
warlocks.push(new Warlock(canvas.width / 2, canvas.height / 2))

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
