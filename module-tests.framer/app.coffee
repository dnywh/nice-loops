# modules
dragMe = require "dragMe"
clickMe = require "clickMe"
scaleMe = require "scaleMe"

# Create a background
background = new BackgroundLayer backgroundColor: "rgba(51, 204, 255, 1)"


	
# Create layer
layerA = new Layer
	width: 200
	height: 200
	borderRadius: 8
	backgroundColor: "white"
	index: 2
layerA.center()

# Create layer
layerB = new Layer
	width: 200
	height: 200
	borderRadius: 8
	backgroundColor: "#28affa"
	index: 1
layerB.center()
	
dragMe.makeDraggable(layerA)
clickMe.makeClickable(layerA)
scaleMe.makeScalable(layerA, layerB)

