shortcuts = require "shortcuts"

Framer.Defaults.Animation = 
	time: 0.2
	curve: 'spring'
	curveOptions:
		tension: 300
		friction: 35
		velocity: 10

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

# The stop button
stop = new Layer
	superLayer: box
	backgroundColor: '#FFF'
	width: 74
	height: 74
	borderRadius: 74;
	scale: 0.2
# 	Hidden to start with
	visible = false
stop.centerX()
stop.centerY()

rec.on Events.Click, ->
	stop.visible = true
	stop.fadeIn()
	stop.animate
		properties:
			scale: 1
			borderRadius: 3
		
	this.animate
		properties:
			scale: 6
		curve: "ease-in-out"
		time: 0.3
		

stop.on Events.Click, ->
	
	this.fadeOut()
	this.animate
		properties:
			scale: 1
			borderRadius: 74
	this.visible = false
	
	rec.animate
		properties:
			scale: 1
		curve: "ease-in-out"
		time: 0.3

