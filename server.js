var express = require('express')
var http = require('http')
var path = require('path')
var socketIO = require('socket.io')
var app = express()
var server = http.Server(app)
var io = socketIO(server)
const Constants = require('./lib/constants')
console.log(Constants)


app.set('port', 5000)
app.use('/static', express.static(__dirname + '/static'))

// Маршруты
app.get('/', function(request, response) {
   response.sendFile(path.join(__dirname, 'index.html'))
})

// Запуск сервера
server.listen(5000, function() {
 console.log('Запускаю сервер на порте 5000')
})

var players = {}

io.on('connection', function(socket) {
    socket.on('newPlayer', function() {
        players[socket.id] = {
            x:  Math.random() * 1000,
            y:  Math.random() * 1000,
            finalPosition: false 
        }
    })
    socket.on('mousedown', function(data) {
        var player = players[socket.id] || {}
        player.finalPosition = data
    })

    socket.on('disconnect', function() {
        var id = socket.id
        delete players[id]
    });
});

setInterval(function() {
    for(var id in players) {
        var player = players[id]
        if (player.finalPosition) {
            if (player.x !== player.finalPosition.x) {
                player.x += player.finalPosition.x > player.x ? 1 : -1
            }
            if (player.y !== player.finalPosition.y) {
                player.y += player.finalPosition.y > player.y ? 1 : -1
            }
        }
    }

    io.sockets.emit('state', players)
}, 1000/60)
