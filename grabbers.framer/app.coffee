Framer.Defaults.Animation = 
	time: 0.2
	curve: 'spring(800, 35, 10)'
	
# background
background = new Layer
	width: Screen.width, height: Screen.height
	backgroundColor: "#2DD7AA"
	borderRadius: 10, opacity: 0.5
	
background.states.add
	small: scale: 0.92
	
# foreground
foreground = new Layer
	width: Screen.width, height: Screen.height
	backgroundColor: "#0FB0F4"
# foreground.draggable.constraints = 
# 	x: 0, y: Screen.height, width: Screen.width, height: Screen.height

content = new Layer
	width: 450, height: 600
	backgroundColor: "transparent", opacity: 0.5, borderRadius: 20
	borderWidth: 7, borderColor: "#fff"
	superLayer: foreground
content.center()

grabbers = new Layer
	y: 50, clip: false, superLayer:foreground,
	backgroundColor: 'transparent',
	width: 300, height: 90
grabbers.centerX() 
	
grab1 = new Layer
	y: 30, width: 200, height: 10, superLayer: grabbers
	backgroundColor: "#fff", borderRadius: 100, opacity: 0.5
grab1.centerX()
grab2 = new Layer
	y: grab1.maxY+10, width: 140, height: 10, superLayer: grabbers
	backgroundColor: "#fff", borderRadius: 100, opacity: 0.5
grab2.centerX()

bounceCurve = 'spring(700, 20, 0)'
bounceOut = new Animation
	layer: foreground
	properties: y: 150, borderRadius: 20
	curve: bounceCurve
bounceIn = new Animation
	layer: foreground
	properties: y: 0, borderRadius: 0
	curve: bounceCurve
	
grabbers.on Events.Click, ->
	if background.states.current is 'default'
		bounceOut.start()
		background.states.switch('small')
		foreground.on Events.AnimationEnd, ->
			bounceIn.start()
			Utils.delay 0.1, ->
				background.states.switch('default')
grabbers.on Events.DragStart, ->
	foreground.draggable.enabled = true
	foreground.draggable.horizontal = false
	foreground.draggable.speedY = 0.5
# foreground.on Events.DragMove, ->
# 	foreground.animate
# 		properties:
# 			borderRadius: 20
# 			scale: 0.96
# 	background.animate
# 		properties:
# 			borderRadius: 20
# 			scale: 0.9
