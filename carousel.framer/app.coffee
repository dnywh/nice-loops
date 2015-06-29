# http://share.framerjs.com/77lfepwq2zmy/

bg = new BackgroundLayer
	backgroundColor: '#7F78F4'

canvas = new Layer
	width: 1200
	height: 800
	backgroundColor: 'transparent'
canvas.center()

window.onresize = ->
	canvas.center()

# Let's set up a variable to use for all the square heights and widths
square = 400

# A variable for the curve of animation
bounce = "spring(200,20,0)"


# Now let's define all the shapes and their square superLayers
# Circles
circleTopSquare = new Layer
	superLayer: canvas
	width: square
	height: square

	backgroundColor: '#bffac2'
circleTopSquare.centerX()

circleBottomSquare = new Layer
	superLayer: canvas
	width: square
	height: square
	y: square
	backgroundColor: '#78f47f'
circleBottomSquare.centerX()

circleTop = new Layer
	width: 300
	height: 150
	x: 50
	y: 250
	backgroundColor: '#78f47f'
circleTop.style.borderRadius = "200px 200px 0 0"

circleBottom = new Layer
	width: 300
	height: 150
	x: 50
	y: 0
	backgroundColor: '#bffac2'
circleBottom.style.borderRadius = "0 0 200px 200px"

circleTopSquare.addSubLayer(circleTop)
circleBottomSquare.addSubLayer(circleBottom)



# Squares
squareTopSquare = new Layer
	superLayer: canvas
	width: square
	height: square
	backgroundColor: '#f47f78'
squareTopSquare.centerX()

squareBottomSquare = new Layer
	superLayer: canvas
	width: square
	height: square
	y: square
	backgroundColor: '#fac2bf'
squareBottomSquare.centerX()

squareTop = new Layer
	width: 300
	height: 150
	x: 50
	y: 250
	backgroundColor: '#fac2bf'

squareBottom = new Layer
	width: 300
	height: 150
	x: 50
	y: 0
	backgroundColor: '#f47f78'

squareTopSquare.addSubLayer(squareTop)
squareBottomSquare.addSubLayer(squareBottom)
# 
# 
# 
# # Triangles
triangleTopSquare = new Layer
	superLayer: canvas
	width: square
	height: square
	backgroundColor: '#bff6fa'
triangleTopSquare.centerX()

triangleBottomSquare = new Layer
	superLayer: canvas
	width: square
	height: square
	y: square
	backgroundColor: '#78edf4'
triangleBottomSquare.centerX()

triangleTop = new Layer
	width: 0
	height: 0
	x: 50
	y: 250
	backgroundColor: 'transparent'
triangleTop.style.borderStyle = "solid"
triangleTop.style.borderWidth = "0 150px 300px 150px"
triangleTop.style.borderColor = "transparent transparent #78edf4 transparent"

triangleBottom = new Layer
	width: 0
	height: 0
	x: 50
	y: -150
	backgroundColor: 'transparent'
triangleBottom.style.borderStyle = "solid"
triangleBottom.style.borderWidth = "0 150px 300px 150px"
triangleBottom.style.borderColor = "transparent transparent #bff6fa transparent"


triangleTopSquare.addSubLayer(triangleTop)
triangleBottomSquare.addSubLayer(triangleBottom)


# Arrange each individual square in place for the load/default state (from storyboard)
# Put everything else to left of visible screen
triangleBottomSquare.x = -square
circleBottomSquare.x = -square
circleTopSquare.x = -square
squareTopSquare.x = -square


# A couple of shortcut functions
Layer::moveIn = ->
	this.animate
		properties:
			x: this.x + 800
		curve: bounce
		
Layer::moveOut = ->
	this.animate
		properties:
			x: this.x + 810
		curve: bounce
	# Put back
	Utils.delay 1, ->
		this.x = -square
		
		
go = ->
	Utils.delay 1, ->
		squareBottomSquare.moveOut()
		circleBottomSquare.moveIn()
		
	Utils.delay 2, ->
		triangleTopSquare.moveOut()
		squareTopSquare.moveIn()
		
	Utils.delay 3, ->
		
		circleBottomSquare.moveOut()
		triangleBottomSquare.moveIn()
		
	Utils.delay 4, ->
		# Not sure why I have to force this...
		squareBottomSquare.x = -400
		squareTopSquare.moveOut()
		circleTopSquare.moveIn()
	
	Utils.delay 5, ->
		
		triangleBottomSquare.moveOut()
		squareBottomSquare.moveIn()

	Utils.delay 6, ->
		circleTopSquare.moveOut()
		# Not sure why I have to force this...
		triangleTopSquare.x = -400
		triangleTopSquare.moveIn()

go()

