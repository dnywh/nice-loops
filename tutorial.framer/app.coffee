# Constraints box layer
constraintsBox = new Layer
	x: 110
	y: 100
	width: 480
	height: 200
	backgroundColor: '#28affa'
	opacity: 0.3
	borderRadius: 200
    

# Create layer
layerA = new Layer
	x: 100
	y: 100
	width: 200
	height: 200
	borderRadius: 200
	backgroundColor: "#28affa"

layerA.states.add
	second:	scale: 0.75
	third:	rotation: 90, scale: 1
	
layerA.states.animationOptions =
	curve: 'spring(100, 30, 0)'


layerA.draggable.enabled = true
layerA.draggable.vertical = false

# Set the constraints frame
layerA.draggable.constraints = {
    x: 100
    y: 100
    width: 500
    height: 200
}

layerA.on Events.DragStart, ->
	this.animate
		properties:
			scale: 1.1
		time: 0.2
		
layerA.on Events.DragMove, ->
	constraintsBox.animate
		properties:
			scale: 0.9
		time: 0.2
	
layerA.on Events.DragEnd, ->
	this.animate
		properties:
			scale: 1
		time: 0.1
	constraintsBox.animate
		properties:
			scale: 1
		time: 0.1
		
layerA.draggable.overdrag = false
layerA.draggable.bounce = false	
layerA.draggable.momentum = true

layerA.on Events.DragAnimationDidStart, ->
	this.animate
		properties:
			scale: 2
		