# Thanks to Randi Dumaguet for help

shortcuts = require "shortcuts"

Framer.Defaults.Animation = 
	time: 0.2
	curve: 'spring(300, 35, 10)'

# Background/backdrop fill
bg = new BackgroundLayer
	backgroundColor: '#CFCFCF'
# 	
# The background box for all this
box = new Layer
	backgroundColor: '#F5F5F5'
	width: 375*2
	height: 140*2
box.centerX()
box.centerY()

# Make this stick to the center if the window size changes
window.onresize = ->
	box.center()
	
# The record button
rec = new Layer
	superLayer: box
	backgroundColor: '#FF3333'
	width: 74*2
	height: 74*2
	borderRadius: 74;
rec.centerX()
rec.centerY()

rec.states.add
	recording:
		scale: 6

# The stop button
stop = new Layer
	superLayer: box
	backgroundColor: '#FFF'
	width: 64*2
	height: 64*2
	borderRadius: 64
	scale: 0.2
	opacity: 0
stop.centerX()
stop.centerY()

stop.states.add
	recording:
		scale: 1
		borderRadius: 3
		opacity: 1
		
# Recording indicator
indicator = new Layer
	superLayer: box
	x: 33*2
	width: 16*2
	height: 16*2
	borderRadius: 16
	backgroundColor: '#FFF'
indicator.centerY()
# Start small
indicator.scale = 0.75
indicator.hide()

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
		
	
# The events
rec.on Events.Click, ->
	rec.states.next()
	stop.states.next()
	
	# Start pulse
	Utils.delay 0.33, ->
		indicator.fadeIn()
		pulseOut.start()
		# Repeat pulse
		pulseOut.on 'end', ->
			pulseIn.start()
		pulseIn.on 'end', ->
			pulseOut.start()
	
stop.on Events.Click, ->
	indicator.hide()
	pulseIn.stop()
	pulseOut.stop()
	rec.states.next()
	stop.states.next()