# Thanks to Randi Dumaguet for help

shortcuts = require "shortcuts"

Framer.Defaults.Animation = 
	time: 0.2
	curve: 'spring(300, 35, 10)'

# Background/backdrop fill
# bg = new BackgroundLayer
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
	
# The events
rec.on Events.Click, ->
	rec.states.next()
	stop.states.next()
	
stop.on Events.Click, ->
	rec.states.next()
	stop.states.next()