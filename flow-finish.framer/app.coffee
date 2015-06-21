# Thanks to Balraj Chana
# https://www.facebook.com/groups/framerjs/permalink/697925247001216/

Framer.Defaults.Animation = 
	time: 0.2
	curve: 'spring(300, 35, 0)'
	
# Background/backdrop fill for fullscreen
bg1 = new BackgroundLayer
	backgroundColor: '#00FFB1'			
bg2 = new BackgroundLayer
	backgroundColor: '#00DCE8'
bg3 = new BackgroundLayer
	backgroundColor: '#F16BD6'
bg = new BackgroundLayer
	backgroundColor: 'black'
	
bg1.states.add
	up: maxY: 50, borderRadius: 10
	summary: maxY: 50*4, borderRadius: 10
	out: maxY: 0
bg2.states.add
	up: maxY: 100, borderRadius: 10
	summary: maxY: 100*4, borderRadius: 10
	out: maxY: 0
bg3.states.add
	up: maxY: 150, borderRadius: 10
	summary: maxY: 150*4, borderRadius: 10
	out: maxY: 0
	
dotSummaryWrapper = new Layer
	clip: false, backgroundColor: 'transparent', x: -50, opacity: 0, width: Screen.width, height: Screen.height/2
	
dotSummaryWrapper.states.add
	pushIn: x: 0, opacity: 1

	width = 90
	height = 90
	gutter = 30
	
	for i in [0..2]
		dotSummary1 = new Layer
			x: i * (width + gutter) + 50, y: 60, width: width, height: height, borderRadius: width, backgroundColor: "white", superLayer: dotSummaryWrapper, opacity: 0.8
		
	for i in [0..3]
		dotSummary2 = new Layer
			x: i * (width + gutter) + 50, y: 260, width: width, height: height, borderRadius: width, backgroundColor: "white", superLayer: dotSummaryWrapper, opacity: 0.8
			
	for i in [0..1]
		dotSummary3 = new Layer
			x: i * (width + gutter) + 50, y: 460, width: width, height: height, borderRadius: width, backgroundColor: "white", superLayer: dotSummaryWrapper, opacity: 0.8

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
	summary: scale: 1.2, opacity: 1, y: Screen.height-tickButton.height*2
	finish: midY: Screen.height/2, scale: 1.4
	
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
	
# Functions
allUp = () ->
	# Reset everything
	Utils.delay 0.2, ->	
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
			dot.states.switch('default') for dot in dots
			# background actions
			if bg1.states.current is 'default'
				bg1.states.switch('up')
				allUp()
			else if bg1.states.current is 'up' && bg2.states.current is 'default'
				bg2.states.switch('up')
				allUp()
			else if bg2.states.current is 'up' && bg3.states.current is 'default'
				bg1.states.switch('summary')
				bg2.states.switch('summary')
				bg3.states.switch('summary')
				Utils.delay 0.2, ->
					tickButton.states.switch('summary')
					dotSummaryWrapper.states.switch('pushIn')
				
	else if tickButton.states.current is 'summary'
		dotSummaryWrapper.opacity = 0
		bg1.states.switch('out')
		bg2.states.switch('out')
		bg3.states.switch('out')
		Utils.delay 0.35, ->
			tickButton.states.switch('finish')