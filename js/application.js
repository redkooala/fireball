var
    game = new GameCore(),
    gameCompents = game.build(),
    canvas = gameCompents.canvas,
    ctx = gameCompents.ctx

document.querySelector( 'body' ).appendChild( canvas )

var center = {
    x:  canvas.width  /2,
    y:  canvas.height /2
}

function drawArena(  ) {
    var
        polygonPadding = canvas.width / 15,
        borderOffset = canvas.height / 3.5,
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


var warlock = function ( ) {
    this.x = 400
    this.y = 500
}

warlock.prototype = {

    draw: function () {
         if(this.target) {
             this.x = this.x > this.target.x ? this.x - 1 : this.x + 1
             this.y = this.y > this.target.y ? this.y - 1 : this.y + 1
         }

        ctx.drawImage(resources.get('img/warlock.jpg'), this.x , this.y , 100, 100);
    }
}

var balls = []
window.onkeypress = function ( event ) {
    if(event.code === 'Space') {
        balls.push( new fireBall( w.x, w.y, mouse ))
    }
}


window.onmousemove = function( event ) {
    offsetTop = event.target.offsetTop,
        offsetLeft = event.target.offsetLeft,
        positionY = event.pageY - offsetTop,
        positionX = event.pageX - offsetLeft

    mouse.x = positionX
    mouse.y = positionY
}

//HEPLERS
window.onmousedown = function ( event ) {
    if( event.target === canvas ) {
        var
            offsetTop = event.target.offsetTop,
            offsetLeft = event.target.offsetLeft,
            positionY = event.pageY - offsetTop,
            positionX = event.pageX - offsetLeft

        mouse.x = positionX - 50
        mouse.y = positionY - 50
        w.target = {x: event.pageX - offsetLeft -50, y: event.pageY - offsetTop - 50}
    }
}

var fireBall = function ( x,y, target ) {
    this.x = x
    this.y = y
    this.target = target

    var dx = this.x > target.x ? - 3:  +3
    var dy  = this.y > target.y ? - 3:  +3


    this.draw =  function () {
        if(this.target) {
            this.x = this.x + dx
            this.y = this.y + dy
        }

        ctx.drawImage(resources.get('img/fireball.png'), this.x , this.y , 200, 50);
    }
}



var createImage = function (  ) {
    ctx.drawImage(resources.get('img/fireball.png'), 300 , 400 , 200, 50);
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
    terrainPattern = ctx.createPattern(resources.get( 'img/bitum.png' ), 'repeat')
    lavaPattern = ctx.createPattern(resources.get( 'img/lava.png' ), 'repeat')

    lastTime = Date.now()
    main()
}

var drowFireBalls  = function () {
    balls.forEach( function (ball) {
        ball.draw()
    } )
}

var w = new warlock()

function render() {


    ctx.fillStyle = terrainPattern
    ctx.fillStyle = lavaPattern
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    drawArena()
    w.draw()
    drowFireBalls()

};


window.onload = function() {
    resources.load([
        'img/bitum.png',
        'img/lava.png',
        'img/warlock.jpg',
        'img/fireball.png'
    ]);
    resources.onReady(init);
}