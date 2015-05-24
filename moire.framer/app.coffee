Framer.Device.setOrientation(0, false)

# Require module
module = require "OrientationEvents"

# Setup OrientationEvents
module.OrientationEvents()

# Screen height/width – used later in modulate
screenHeight = Framer.Device.screen.height
screenWidth = Framer.Device.screen.width

# Sets smoothing for all smooth[Variable]
module.smoothOrientation = .35

# Set background
bg = new BackgroundLayer backgroundColor: "#FFF"
bg.bringToFront()

# Create colour layer
colourBox = new Layer
	x: 200
	y: 100
	width: 400
	height: 800
	rotation: -12
	backgroundColor: "#28affa"
colourBox.center()
colourBox.visible = false

# Variables
rows = 60
cols = 1
gutter = 32
width  = Screen.height
height = 6

# wrapper1 that will center the grid
wrapper1 = new Layer 
	backgroundColor: "transparent"
	clip: false
	width: 2200, height: Screen.height
	rotation: 24
	x: -200
	
# Create the grid layers
for rowIndex in [0...rows]
	for colIndex in [0...cols]
		
		cell = new Layer
			width:  width
			height: height
			x: colIndex * (width + gutter)
			y: rowIndex * (height + gutter)
			borderRadius: 2
			backgroundColor: "#000"
			superLayer: wrapper1
			
# Center the wrapper1
# wrapper1.center()

# wrapper1 that will center the grid
wrapper2 = new Layer 
	backgroundColor: "transparent"
	clip: false
	width: 2200, height: Screen.height
	rotation: 30
	
# Create the grid layers
for rowIndex in [0...rows]
	for colIndex in [0...cols]
		
		cell = new Layer
			width:  width
			height: height
			x: colIndex * (width + gutter)
			y: rowIndex * (height + gutter)
			borderRadius: 2
			backgroundColor: "#000"
			superLayer: wrapper2



# Just so it constantly print NaN when in Framer Studio (and not running from mobile device)
if Utils.isMobile()
	Utils.interval .1, ->
		gamma = module.orientation.gamma
		
		wrapper1.animate
			properties:
				midX: Utils.modulate(gamma, [-10, 10], [175, 575], true)
# 				rotation: (Utils.modulate(gamma, [-10, 10], [175, 575], true))*0.1
			curve: "spring(450, 110, 0)"
