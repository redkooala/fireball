var game = new GameCore(), gameCompents = game.build(), canvas = gameCompents.canvas,
    ctx = gameCompents.ctx

document.querySelector( 'body' ).appendChild( canvas )

var center = {
    x:  canvas.width  /2,
    y:  canvas.height /2
}

function drawArena() {
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

var balls = []
window.onkeypress = function ( event ) {
    if(event.code === 'Space') {
       // balls.push( new fireBall( w.x, w.y, mouse ))
    }
}


window.onmousemove = function( event ) {
    var offsetTop = event.target.offsetTop,
        offsetLeft = event.target.offsetLeft,
        positionY = event.pageY - offsetTop,
        positionX = event.pageX - offsetLeft

    mouse.x = positionX
    mouse.y = positionY
}



var fireBall = function (x, y, target) {
    this.x = x
    this.y = y
    this.target = target

    var dx = this.x > target.x ? -3 : +3
    var dy = this.y > target.y ? -3 : +3

    this.draw = function () {
        if (this.target) {
            this.x = this.x + dx
            this.y = this.y + dy
        }

        ctx.drawImage(resources.get('/static/img/fireball.png'), this.x, this.y, 200, 50);
    }
}



var createImage = function (  ) {
    ctx.drawImage(resources.get('/static/img/fireball.png'), 300 , 400 , 200, 50)
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

var drowFireBalls  = function () {
    balls.forEach( function (ball) {
        ball.draw()
    } )
}

var warlock = function (x, y) {
    this.x = x
    this.y = y
}

warlock.prototype = {
    draw: function () {
        if (this.direction) {
            var speed = {
                x: this.direction.x - this.x,
                y: this.direction.y - this.y
            }

            var length = Math.sqrt(Math.pow(speed.x, 2) + Math.pow(speed.y, 2))

            this.x += speed.x/length * 2
            this.y += speed.y/length * 2
            
        }

        ctx.fillStyle = 'red'
        ctx.beginPath();
        ctx.arc(this.x, this.y, 25, 0, 2 * Math.PI);
        ctx.fill();

        //ctx.drawImage(resources.get('/static/img/warlock.jpg'), this.x , this.y , 100, 100);
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
        // var direction = {
        //     x: mouse.x - player.x,
        //     y: player.y - mouse.y
        // }
    }
}


warlocks = []
warlocks.push(new warlock(mouse.x, mouse.y))

// socket.on('state', function(players) {
//     warlocks = []
//     for (var id in players) {
//         var player = players[id];
//         var position = player.positonVector
//         let w = new warlock(position.x, position.y)
//         warlocks.push(w)
//   }
// })

function render() {
    ctx.fillStyle = terrainPattern
    ctx.fillStyle = lavaPattern
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    drawArena()
    warlocks.forEach(function(w) {
        w.draw()
    })
    drowFireBalls()
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
