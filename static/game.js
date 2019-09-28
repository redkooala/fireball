let socket = io()

var GameCore = function () {
    this.build = function () {
       var canvas = _createCanvas()
       return canvas
    }

    socket.emit('newPlayer')


    _createCanvas = function () {
        var canvas = document.createElement( "canvas" )
        var ctx = canvas.getContext( "2d" )
        canvas.width = 940 
        canvas.height = 940
        return  { canvas: canvas, ctx: ctx }
    }
}
