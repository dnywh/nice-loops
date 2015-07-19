largeSize = 360
smallSize = largeSize/4

# Create a background
background = new BackgroundLayer backgroundColor: "#DDD"

# Create a layer
square = new Layer
	width: largeSize, height: largeSize
	backgroundColor: "#FFF", borderRadius: largeSize
square.center()

small = new Layer
	width: smallSize, height: smallSize
	y: Screen.height+smallSize
	backgroundColor: "#FFF", borderRadius: smallSize
small.centerX()

# Create additional states
square.states.add
	second: scale: 1.5, rotation: 225
	third:  scale: 0.5, blur: 25, borderRadius: largeSize

# Create a spring animation
square.states.animationOptions =
	curve: "spring(largeSize,25,0)"
	
# small load animation
smallUp = new Animation
	layer: small
	properties:
		y: Screen.height-smallSize*2
	time: 0.4
	curve: "ease"
	
# Load animation on page load
smallUp.start()

smallPush = new Animation
	layer: small
	properties:
		y: square.midY
		scale: 2
	time: 1
	curve: "spring(100,25,0)"

# Animate to the next state on click
background.on Events.Click, ->
	smallPush.start()
	
	Utils.delay 0.23, ->
		square.animate
			properties:
				scale: square.scale + 0.1
			curve: "spring(100,20,100)"
		
	Utils.delay 0.8, ->
		small.y = Screen.height+smallSize
		small.scale = 1
		smallUp.start()
		

square.on "change:scale", ->
    if square.width > 1.2
    	this.animate
			properties:
				y: 0




