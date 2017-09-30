var GameCore = function () {
    this.build = function () {
       var canvas = _createCanvas()
       return canvas
    }

    _createCanvas = function () {
        var canvas = document.createElement( "canvas" )
        var ctx = canvas.getContext( "2d" )
        canvas.width = 1000
        canvas.height = 1000
        return  { canvas: canvas, ctx: ctx }
    }
}