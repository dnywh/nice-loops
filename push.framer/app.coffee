shortcuts = require "shortcuts"

wide = 140
high = 220
gutter = 20

Framer.Defaults.Animation = 
	time: 0.2
	curve: 'spring(500, 35, 10)'
	
bg = new BackgroundLayer
	backgroundColor: '#7F78F4'
	
canvas = new Layer
	width: (wide*2)+gutter
	height: high
	backgroundColor: 'transparent'
canvas.centerX()
canvas.centerY()
# Make this stick to the center if the window size changes
window.onresize = ->
	canvas.center()
	
left = new Layer
	superLayer: canvas
	originY: 0.75
	backgroundColor: '#fff'
	opacity: 0.75
	height: high
	width: wide
	borderRadius: 3
left.centerY()

right = new Layer
	superLayer: canvas
	originY: 0.75
	backgroundColor: '#fff'
	opacity: 0.75
	height: high
	width: wide
	borderRadius: 3
	x: wide+gutter
right.centerY()

# Create an array for the two layers
Switches = [left, right]

for layers in Switches
	layers.states.add
		one: scale: 0.8, opacity: 0.5, borderRadius: 6
		two: scale: 1.0, opacity: 0.75, borderRadius: 3
		
left.on Events.TouchStart, ->
	this.states.next('one')
left.on Events.TouchEnd, ->
	this.states.next('two')

right.on Events.TouchStart, ->
	this.states.next('one')
right.on Events.TouchEnd, ->
	this.states.next('two')


