width = 750
height = 1334

contentWidth = 500
contentHeight = 880

shortcuts = require "shortcuts"

Framer.Defaults.Animation = 
	time: 0.2
	curve: 'spring(300, 35, 10)'
	
# Background/backdrop fill
# bg = new BackgroundLayer
# 	backgroundColor: 'black'
# 	
# The background box for all this
box = new Layer
	backgroundColor: 'transparent'
	width: width*4
	height: height*4
# box.centerX()
# box.centerY()

# Make this stick to the center if the window size changes
# window.onresize = ->
# 	box.center()

content = new Layer
	backgroundColor: 'white'
	width: contentWidth
	height: contentHeight
	borderRadius: 8
content.center()
		

# top left corner
bg1 = new Layer
	x: 0, y: 0, width: width, height: height, superLayer: box, backgroundColor: 'blue'

# top right corner
bg2 = new Layer
	x: width, y: 0, width: width, height: height, superLayer: box, backgroundColor: 'pink'

# bottom right corner
bg3 = new Layer
	x: width, y: height, width: width, height: height, superLayer: box, backgroundColor: 'red'
	
# bottom left corner
bg4 = new Layer
	x: 0, y: height, width: width, height: height, superLayer: box, backgroundColor: 'green'
	
content.on Events.Click, ->
	# default state at 0, 0 (top left corner)
	if box.x is 0 && box.y is 0
		content.slideToLeft()
		Utils.delay 0.2, ->
			box.animate
				properties:
					x: -width
		Utils.delay 0.4, ->
			content.x = width
			content.animate
				properties:
					x: (width - contentWidth) / 2 # 125
				
	# 750, 0 (top right corner)
	if box.x is -width && box.y is 0
		content.slideToTop()
		Utils.delay 0.2, ->
			box.animate
				properties:
					y: -height
		Utils.delay 0.4, ->
			content.y = height
			content.animate
				properties:
					y: (height - contentHeight) / 2 # 227
				
	# 750, 1334 (bottom right corner)
	if box.x is -width && box.y is -height
		content.slideToRight()
		Utils.delay 0.2, ->
			box.animate
				properties:
					x: 0
		Utils.delay 0.4, ->
			content.x = -contentWidth
			content.animate
				properties:
					x: (width - contentWidth) / 2 # 125
				
	# 750, 1334 (bottom left corner)
	if box.x is 0 && box.y is -height
		content.slideToBottom()
		Utils.delay 0.2, ->
			box.animate
				properties:
					y: 0
		Utils.delay 0.4, ->
			content.y = -contentHeight
			content.animate
				properties:
					y: (height - contentHeight) / 2 # 227
	