Framer.Defaults.Animation = 
	time: 0.2
	curve: 'spring(300, 35, 0)'
	
# Background/backdrop fill for fullscreen
bg1 = new BackgroundLayer
	backgroundColor: '#0FB1F5'
bg2 = new BackgroundLayer
	backgroundColor: '#947DDA'
bg3 = new BackgroundLayer
	backgroundColor: '#00D8AE'
bg4 = new BackgroundLayer
	backgroundColor: '#FDA155'
	
bg1.states.add
	up: maxY: 40, borderRadius: 8
bg2.states.add
	up: maxY: 80, borderRadius: 8
bg3.states.add
	up: maxY: 120, borderRadius: 8
bg4.states.add
	up: maxY: 160, borderRadius: 8

# Explainer text dummy stuff
text = new Layer
	width: 570, height: 205, backgroundColor: 'transparent', opacity: 0, clip: false
text.center()

header = new Layer
	width: 480, height: 75, backgroundColor: 'white', borderRadius: 5, superLayer: text
header.centerX()

line1 = new Layer
	y: header.maxY+ 55, width: 570, height: 25, backgroundColor: 'white', borderRadius: 3, superLayer: text
line1.centerX()

line2 = new Layer
	y: line1.maxY+ 25, width: 500, height: 25, backgroundColor: 'white', borderRadius: 3, superLayer: text
line2.centerX()

textOut = new Animation
	layer: text
	properties: y: text.height, opacity: 0
	
textUp = new Animation
	layer: text
	properties: y: 220, opacity: 0.8

# The tick
tickButton = new Layer
	width: 240, height: 240, borderRadius: 240, scale: 0.9, opacity: 0.33, borderColor: 'white', borderWidth: 8, backgroundColor: 'transparent'
tickButton.centerX()
tickButton.y = Screen.height

tick = new Layer
	width:240, height:179, image:"images/tick.png", scale: 0.5, superLayer: tickButton
	
tick.center()
# optical alignment
tick.y = tick.y-10
tick.x = tick.x-7

tickButton.states.add
	ready: scale: 1, opacity: 1
	
tickButtonOut = new Animation
	layer: tickButton
	properties: opacity: 0, scale: 0.25
	
tickButtonUp = new Animation
	layer: tickButton
	properties: y: Screen.height-tickButton.height*1.3, opacity: 0.33, scale: 0.9

	
# The dots

# Variables
rows = 2
cols = 4
gutter = 50
width = height = 120

# Wrapper that will center the grid of dots
wrapper = new Layer 
	backgroundColor: "transparent", clip: false
	width: (width*cols) + (gutter*(cols-1)),
	height: (height*rows) + gutter,
	y: Screen.height

wrapperOut = new Animation
	layer: wrapper
	properties: y: wrapper.height, opacity: 0
	
wrapperUp = new Animation
	layer: wrapper
	properties: y: 610, opacity: 1

# Create an array to hold the dots so we can target it later
dots = []
# Create the grid layers
for rowIndex in [0...rows]
	for colIndex in [0...cols]
	
		dot = new Layer
			width:  width
			height: height
			x: colIndex * (width + gutter)
			y: rowIndex * (height + gutter)
			borderRadius: width
			backgroundColor: "#fff"
			superLayer: wrapper
			opacity: 0.6
			scale: 0.9
		
		# Push dot into dots array
		dots.push dot
		# Create & tweak the states
		dot.states.add
			clicked: scale: 1.1, opacity: 1
		dot.states.animationOptions = 
			curve: "spring(600,30,50)"
			
		dot.on Events.Click, ->
			this.states.next()
			tickButton.states.switch('ready')
		
			currentState = this.states.current
			
			if currentState == 'default'
				tickButton.states.switch('default')
			
# Center the wrapper
wrapper.centerX()
wrapper.y = Screen.height

# Starting animations
Utils.delay 0.5, ->
	textUp.start()
Utils.delay 0.75, ->
	wrapperUp.start()
Utils.delay 1, ->
	tickButtonUp.start()	

# Animations when going to next screen
tickButton.on Events.Click, ->
	if tickButton.states.current is 'ready'
		textOut.start()
		Utils.delay 0.1, ->
			wrapperOut.start()
		Utils.delay 0.2, ->
			tickButtonOut.start()
		Utils.delay 0.3, ->
			# Switch states back to default for each dot
			dot.states.switch("default") for dot in dots
			# background actions
			if bg1.states.current is 'default'
				bg1.states.switch('up')
			else if bg1.states.current is 'up' && bg2.states.current is 'default'
				bg2.states.switch('up')
			else if bg2.states.current is 'up' && bg3.states.current is 'default'
				bg3.states.switch('up')
			else if bg3.states.current is 'up' && bg4.states.current is 'default'
				bg4.states.switch('up')
		
		# Reset everything
		Utils.delay 0.5, ->	
			text.opacity = 0
			text.center()
			
			wrapper.opacity = 0
			wrapper.y = Screen.height
			
			tickButton.states.switchInstant('default')
			tickButton.y = Screen.height
			
			# Now bring it all back in
			textUp.start()
			wrapperUp.start()
			tickButtonUp.start()
