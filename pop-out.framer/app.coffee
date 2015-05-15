Framer.Defaults.Animation = 
	time: 0.6
	curve: 'spring'
	curveOptions:
		tension: 500
		friction: 28
		velocity: 2
	
# Circle diameter variable	
diameter = 160

# The background that animates
bg = new BackgroundLayer
	backgroundColor: '#FF3735'
	borderRadius: 0
	
# A black background for behind the red
bgBack = new BackgroundLayer
	backgroundColor: '#000'
	borderRadius: 0
	
bg.states.add
	pressed:
		borderRadius: 16
		scale: 0.96

bg.states.animationOptions =
	curve: 'ease-in-out'
	time: 0.15
	
# The main button
button = new Layer
	width: diameter
	height: diameter
	y: Screen.height-diameter*1.6
	borderRadius: diameter
	backgroundColor: '#fff'
button.centerX()

# All pop-out circles, named from left to right
pop1 = new Layer
	width: diameter
	height: diameter
	x: button.x
	y: button.y
	borderRadius: diameter
	backgroundColor: '#ffacab'
	scale: 0.8
	opacity: 0
	
pop1.states.add
	pressed:
		x: 40
		y: pop1.y-50
		scale: 0.8
		opacity: 1
		
pop2 = new Layer
	width: diameter
	height: diameter
	x: button.x
	y: button.y
	borderRadius: diameter
	backgroundColor: '#ffacab'
	scale: 0.8
	opacity: 0
	
pop2.states.add
	pressed:
		x: 140
		y: pop1.y-175
		scale: 0.8
		opacity: 1
		
pop3 = new Layer
	width: diameter
	height: diameter
	x: button.x
	y: button.y
	borderRadius: diameter
	backgroundColor: '#ffacab'
	scale: 0.8
	opacity: 0
	
pop3.states.add
	pressed:
		x: button.x
		y: pop3.y-240
		scale: 0.8
		opacity: 1
		
pop4 = new Layer
	width: diameter
	height: diameter
	x: button.x
	y: button.y
	borderRadius: diameter
	backgroundColor: '#ffacab'
	scale: 0.8
	opacity: 0
	
pop4.states.add
	pressed:
		x: 750-140-pop3.width
		y: pop1.y-175
		scale: 0.8
		opacity: 1

pop5 = new Layer
	width: diameter
	height: diameter
	x: button.x
	y: button.y
	borderRadius: diameter
	backgroundColor: '#ffacab'
	scale: 0.8
	opacity: 0
	
pop5.states.add
	pressed:
		x: 750-40-pop5.width
		y: pop1.y-50
		scale: 0.8
		opacity: 1
		
# Bring that button back to the front
button.bringToFront()

# A bit of bounce on click
button.on Events.TouchStart, ->
	this.animate
		properties:
			scale: 1.5
button.on Events.TouchEnd, ->
	this.animate
		properties:
			scale: 1

# Interactivity
button.on Events.Click, ->
	bg.states.next()
	pop1.states.next()
	Utils.delay 0.1, ->
		pop2.states.next()
	Utils.delay 0.14, ->
		pop3.states.next()
	Utils.delay 0.16, ->
		pop4.states.next()
	Utils.delay 0.18, ->
		pop5.states.next()