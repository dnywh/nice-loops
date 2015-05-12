shortcuts = require "shortcuts"

Framer.Defaults.Animation = 
	time: 0.2
	curve: 'spring(300, 35, 10)'


# Background/backdrop fill
bg = new BackgroundLayer
	backgroundColor: '#CFCFCF'
	
# The background box for all this
box = new Layer
	backgroundColor: '#F5F5F5'
	width: 375
	height: 140
box.centerX()
box.centerY()

# Make this stick to the center if the window size changes
window.onresize = ->
	box.center()
	
# The record button
rec = new Layer
	superLayer: box
	backgroundColor: '#FF3333'
	width: 74
	height: 74
	borderRadius: 74;
rec.centerX()
rec.centerY()

recText = new Layer
	superLayer: rec
	x:0, y:0, width:100, height:24, image:"images/rec.png", scale: 0.5
recText.centerX()
recText.centerY()

# The stop button
stop = new Layer
	superLayer: box
	backgroundColor: '#FFF'
	width: 64
	height: 64
	borderRadius: 74;
	scale: 0.2
# 	Hidden to start with
# 	visible = false
	opacity: 0
stop.centerX()
stop.centerY()

stopText = new Layer
	superLayer: stop
	x:0, y:0, width:68, height:28, image:"images/stop.png", scale: 0.5
	opacity: 0
stopText.centerX()
stopText.centerY()

# Time
# time = new Layer
# 	superLayer: box
# 	x: 33
# 	Default x is 66
# 	width:43, height:18, image:"images/time.gif"
# 	opacity: 0
# time.centerY()

# Recording indicator
indicator = new Layer
	superLayer: box
	x: 33
	width: 16
	height: 16
	borderRadius: 12
	backgroundColor: '#fff'
	opacity: 0
indicator.centerY()
# Start small
indicator.scale = 0.75

# Animation for indicator
pulseOut = new Animation
	layer: indicator
	properties:
		scale: 1
	curve: "ease-in-out"
	time: 1.3	
	
pulseIn = new Animation
	layer: indicator
	properties:
		scale: 0.75
	curve: "ease-in-out"
	time: 1.3
		

		
rec.on Events.Click, ->
	recText.opacity = 0
	stop.fadeIn()
	stop.visible = true
	stop.animate
		properties:
			scale: 1
			borderRadius: 3
	Utils.delay 0.1, ->
		stopText.fadeIn()
		
	this.animate
		properties:
			scale: 6
		curve: "ease-in-out"
		time: 0.3
		
	
	# Start pulse and time
	Utils.delay 0.5, ->
		indicator.fadeIn()
		pulseOut.start()
		# Repeat pulse
		pulseOut.on 'end', ->
			pulseIn.start()
		pulseIn.on 'end', ->
			pulseOut.start()
			
	Utils.delay 0.7, ->
# 		Push and fade in time
# 		time.animate
# 			properties:
# 				x: 60
# 				opacity: 1
# 			curve: 'spring(200, 25, 10)'


stop.on Events.Click, ->
# 	
	this.fadeOut()
	
	Utils.delay 0.2, ->
		indicator.fadeOut()
# 	this.animate
# 		properties:
# 			scale: 1
# 			borderRadius: 74
# 	this.visible = false
# 	
	rec.animate
		properties:
			scale: 1