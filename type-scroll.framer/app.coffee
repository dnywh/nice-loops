shortcuts = require "shortcuts"

Framer.Defaults.Animation =
	curve: 'spring(200, 21, 00)'

#variable to help with spring animation
buffer = 50

leftMargin = 90
width = 320
height = 70
gutter = 200

gutterGap = gutter+300

bgBlue = new BackgroundLayer
	backgroundColor: '#00B1EF'

# article stuff
aWidth = aHeight = 250
aGutter = 30

# the superlayer
articleWrapper = new Layer
	width: 1200
	height: aHeight
	x: leftMargin
	y: 340
	backgroundColor: 'transparent'
	
article1 = new Layer
article2 = new Layer
	x: aWidth+aGutter
article3 = new Layer
	x: aWidth+aGutter+aWidth+aGutter
	
articles = [article1, article2, article3]

for i in articles
	i.superLayer = articleWrapper
	i.backgroundColor = '#FFF'
	i.borderRadius = 2
	i.width = aWidth
	i.height = aHeight
	
# articles start position
articleWrapper.x = Screen.width+buffer

header1 = new Layer
	y:gutter
header2 = new Layer
	y:header1.y+gutterGap
header3 = new Layer
	y:header2.y+gutter
header4 = new Layer
	y:header3.y+gutter
	
headers = [header1, header2, header3, header4]

for i in headers
	i.x = leftMargin
	i.width = width
	i.height = height
	i.backgroundColor = '#fff'
	i.opacity = 0.5
	
header2.states.add
	active:
		opacity: 1

# custom animations
# moving up the headers
Layer::moveUp = ->
	this.animate
		properties:
			y: this.y-360
# scaling down the headers
Layer::scaleDown = ->
	this.animate
		properties:
			opacity: 0.5
			width: width
			height: height
# scaling back down the headers
Layer::scaleUp = ->
	this.animate
		properties:
			opacity: 1
			width: width*1.4
			height: height*1.4
# moving out the article superlayer
Layer::moveOut = ->
	this.animate
		properties:
			x: Screen.width+buffer
# moving in the article superlayer
Layer::moveIn = ->
	this.animate
		properties:
			x: leftMargin
			height: aHeight
			opacity: 1
		curve: 'spring(200, 21, 00)'
		
# articleWrapper disappear & reset
Layer::kill = ->
	this.animate
		properties:
			height: 0
			opacity: 0
	Utils.delay 0.5, ->
		this.x = Screen.width+buffer
		
		
		
# starting animations
headers[0].scaleUp()
articleWrapper.moveIn()


# events
header1.on Events.Click, ->
	articleWrapper.moveIn()
header2.on Events.Click, ->
	articleWrapper.kill()
	header1.scaleDown()
	header2.moveUp()
	header2.scaleUp()
	Utils.delay 0.5, ->
		articleWrapper.moveIn()





