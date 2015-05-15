bg = new BackgroundLayer backgroundColor: "#A793E8"
container1 = new Layer backgroundColor: "transparent", clip:false, width:600, height: 600
container1.center()
window.onresize = -> container1.center()
	
rows = 40
cols = 1

size = 2
margin = 10
ballCurve = "spring(300,20,0)"
startDelta = 200

[1..rows].map (a) ->
	[1..cols].map (b) ->
		ball = new Layer
			x: b * (size + margin)
			y: a * (size + margin)
			backgroundColor: "white"
			width:  500 
			height: size
# 			opacity: 0
# 			borderRadius: 100
			superLayer: container1
		
# 		ball.animate 
# 			properties:
# 				y: a * (size + margin)
# 				opacity: 1
# 			curve: ballCurve
# 			delay: 0.05 * a + 0.05 * b
			

container2 = new Layer backgroundColor: "transparent", clip:false, width:600, height: 600
container2.center()
window.onresize = -> container2.center()
	
rows = 1
cols = 40

[1..rows].map (a) ->
	[1..cols].map (b) ->
		ball = new Layer
			x: b * (size + margin)
			y: a * (size + margin)
			backgroundColor: "white"
			width:  size 
			height: 500
# 			opacity: 0
# 			borderRadius: 100
			superLayer: container2

container2.draggable.enabled = true
container2.draggable.speedX = 0.5

container2.draggable.overdrag = false

container2.on Events.Click, ->
	this.rotation += 20