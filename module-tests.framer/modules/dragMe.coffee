# Add the following line to your project in Framer Studio. 
# myModule = require "myModule"
# Reference the contents by name, like myModule.myFunction() or myModule.myVar


# A draggable function without our module
exports.makeDraggable = (layer) ->
    layer.draggable.enabled = true

    # Store current x and y position
    startX = layer.x
    startY = layer.y

    # Animate back on DragEnd
    layer.on Events.DragEnd, ->
        this.animate
            properties: { x: startX, y: startY }
            curve: "spring(300,20,0)"