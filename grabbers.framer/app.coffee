Framer.Defaults.Animation = 
	time: 0.2
	curve: 'spring(900, 35, 10)'

# background
background = new Layer
	width: Screen.width, height: Screen.height
	backgroundColor: "#78f47f"
	borderRadius: 10, opacity: 0.66
	
# foreground
foreground = new Layer
	width: Screen.width, height: Screen.height
	backgroundColor: "#0FB0F4"
foreground.draggable.enabled = true
foreground.draggable.horizontal = false
foreground.draggable.speedY = 0.5
foreground.draggable.constraints = 
	x: 0, y: Screen.height, width: Screen.width, height: Screen.height

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


foreground.on Events.DragMove, ->
	foreground.animate
		properties:
			borderRadius: 20
			scale: 0.96
	background.animate
		properties:
			borderRadius: 20
			scale: 0.9
