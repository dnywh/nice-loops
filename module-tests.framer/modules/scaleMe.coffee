# Add the following line to your project in Framer Studio. 
# myModule = require "myModule"
# Reference the contents by name, like myModule.myFunction() or myModule.myVar


# A draggable function without our module
exports.makeScalable = (layer, otherLayer) ->
    layer.draggable.enabled = true

    # Animate scale on drag start, and then back to normal on end
    layer.on Events.DragStart, ->
        this.animate
            properties: { scale: 0.9 }
            curve: "spring(300,20,0)"

    # Animate scale on drag move, and then back to normal on end
    layer.on Events.DragEnd, ->
        this.animate
            properties: { scale: 1 }
            curve: "spring(300,20,0)"

        otherLayer.animate
        	properties: {rotation: this.rotation + 45}