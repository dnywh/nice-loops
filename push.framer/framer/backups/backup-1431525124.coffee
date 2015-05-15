shortcuts = require "shortcuts"
{AudioPlayer} = require "audio"

# Sounds by rossf
# https://www.freesound.org/people/rossf/sounds/75839/
# https://www.freesound.org/people/rossf/sounds/75836/
# https://www.freesound.org/people/rossf/sounds/75837/
# https://www.freesound.org/people/rossf/sounds/75842/
cowbell = new Audio 'cowbell.mp3'
clave = new Audio 'clave.mp3'
conga = new Audio 'conga.mp3'
kick = new Audio 'kick.mp3'

# Variables
wide = 160
high = 160
gutter = 20
bgFill = '#7F78F4'

Framer.Defaults.Animation = 
	time: 0.2
	curve: 'spring(900, 35, 10)'
	
bg = new BackgroundLayer
	backgroundColor: bgFill
	
canvas = new Layer
	width: (wide*4)+(gutter*3)
	height: high
	backgroundColor: 'transparent'
canvas.centerX()
canvas.centerY()
# Make this stick to the center if the window size changes
window.onresize = ->
	canvas.center()
	
one = new Layer
	superLayer: canvas
	originY: 0.75
	backgroundColor: '#fff'
	opacity: 0.75
	height: high
	width: wide
	borderRadius: 3
one.centerY()

two = new Layer
	superLayer: canvas
	originY: 0.75
	backgroundColor: '#fff'
	opacity: 0.75
	height: high
	width: wide
	borderRadius: 3
	x: wide+gutter
two.centerY()

three = new Layer
	superLayer: canvas
	originY: 0.75
	backgroundColor: '#fff'
	opacity: 0.75
	height: high
	width: wide
	borderRadius: 3
	x: (wide+gutter)+(wide+gutter)
three.centerY()

four = new Layer
	superLayer: canvas
	originY: 0.75
	backgroundColor: '#fff'
	opacity: 0.75
	height: high
	width: wide
	borderRadius: 3
	x: (wide+gutter)+(wide+gutter)+(wide+gutter)
four.centerY()


# Create an array for the keys
Switches = [one, two, three, four]

# Create an array for the sounds
Sounds = [cowbell, clave, conga, kick]

for layers in Switches
	layers.states.add
		one: scale: 0.8, opacity: 0.5, borderRadius: 6
		two: scale: 1.0, opacity: 0.75, borderRadius: 3
		
one.on Events.TouchStart, ->
	bg.backgroundColor = '#78f47f'
	this.states.next('one')
	cowbell.play()
one.on Events.TouchEnd, ->
	this.states.next('two')

two.on Events.TouchStart, ->
	bg.backgroundColor = '#f47f78'
	this.states.next('one')
	clave.play()
two.on Events.TouchEnd, ->
	this.states.next('two')
	
three.on Events.TouchStart, ->
	bg.backgroundColor = '#0FB0F4'
	this.states.next('one')
	conga.play()
three.on Events.TouchEnd, ->
	this.states.next('two')
	
four.on Events.TouchStart, ->
	bg.backgroundColor = '#FDA155'
	this.states.next('one')
	kick.play()
four.on Events.TouchEnd, ->
	this.states.next('two')
	
# Ability to reset background colour
bg.on Events.Click, ->
	bg.backgroundColor = bgFill