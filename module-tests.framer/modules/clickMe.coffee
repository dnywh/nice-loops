# Add the following line to your project in Framer Studio. 
# myModule = require "myModule"
# Reference the contents by name, like myModule.myFunction() or myModule.myVar


# A draggable function without our module
exports.makeClickable = (layer) ->

    # Animate slight rotation
    layer.on Events.DragEnd, ->
        this.animate
            properties: { rotation: this.rotation + 45 }
            curve: "spring(600,20,0)"