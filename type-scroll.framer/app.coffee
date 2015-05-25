shortcuts = require "shortcuts"

Framer.Defaults.Animation =
	curve: 'spring(260, 21, 0)'
	
bgBlue = new BackgroundLayer
	backgroundColor: '#00B1EF'
bgRed = new BackgroundLayer
	backgroundColor: 'red'
	
# variable to help with spring animation
buffer = 50

# variables for the headers (and global)
leftMargin = 90
width = 340
largeWidth = width*1.4
height = 70
largeHeight = height*1.4
gutter = 200

# variables for the articles
aWidth = aHeight = 250
aGutter = 30
aWrapGutter = 340

# the article superLayer
articleWrapper = new ScrollComponent
	width: (aWidth+aGutter)*3
	height: aHeight
	x: leftMargin
	y: aWrapGutter
	backgroundColor: 'transparent'
	scrollVertical: false

# the gap between a header section and and article header below
gutterGap = articleWrapper.height+articleWrapper.y-(0.5*gutter)
	
# the square articles within the articleWrapper
article1 = new Layer
article2 = new Layer
	x: aWidth+aGutter
article3 = new Layer
	x: aWidth+aGutter+aWidth+aGutter
	
# put them into an array for easy access
articles = [article1, article2, article3]

# easy access as mentioned
for i in articles
	i.superLayer = articleWrapper.content
	i.backgroundColor = '#FFF'
	i.borderRadius = 2
	i.width = aWidth
	i.height = aHeight
	
# articles start position outside of screen
articleWrapper.x = Screen.width+buffer

# the rectangular section headers
header1 = new Layer
	y:gutter
header2 = new Layer
	y:header1.y+gutterGap
header3 = new Layer
	y:header2.y+gutter
header4 = new Layer
	y:header3.y+gutter

# put them into an array for easy access
headers = [header1, header2, header3, header4]

# easy access as mentioned
for i in headers
	i.x = leftMargin
	i.width = width
	i.height = height
	i.backgroundColor = '#fff'
	i.opacity = 0.5
	
# add states to each for active/inactive(default pos and moved pos)
header1.states.add
	active:
		opacity: 1
		width: largeWidth
		height: largeHeight
	inactive:
		opacity: header1.opacity
		width: header1.width
		height: header1.height
header2.states.add
	active:
		opacity: 1
		width: largeWidth
		height: largeHeight
		y: aWrapGutter
	inactive:
		opacity: header2.opacity
		width: header2.width
		height: header2.height
		y: header2.y
	inactiveUp:
		opacity: header2.opacity
		width: header2.width
		height: header2.height
		y: header2.y-360
header3.states.add
	active:
		opacity: 1
		width: largeWidth
		height: largeHeight
		y: header3.y-420
	inactive:
		opacity: header3.opacity
		width: header3.width
		height: header3.height
		y: header3.y
	inactiveUp:
		opacity: header3.opacity
		width: header3.width
		height: header3.height
		y: header3.y-420
header4.states.add
	active:
		opacity: 1
		width: largeWidth
		height: largeHeight
		y: header4.y-460
	inactive:
		opacity: header4.opacity
		width: header4.width
		height: header4.height
		y: header4.y

# custom animations
# moving out the article superLayer
Layer::moveOut = ->
	this.animate
		properties:
			x: Screen.width+buffer
# moving in the article superLayer
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
	# reset articeWrapper to outside screen x
	Utils.delay 0.2, ->
		articleWrapper.x = Screen.width+buffer
		
		
# starting animations
articleWrapper.moveIn()
header1.states.switch('active')

# events
header1.on Events.Click, ->
	# only kill & reset the articleWrapper if it's somewhere else (this header will therefore be inactive)
	if header1.opacity < 1
		articleWrapper.kill()
		Utils.delay 0.2, ->
			articleWrapper.y = header1.y + 140
			articleWrapper.moveIn()
	
	header1.states.switch('active')
	header2.states.switch('inactive')
	header3.states.switch('inactive')
	header4.states.switch('inactive')
	
header2.on Events.Click, ->
	articleWrapper.kill()

	header2.states.switch('active')

	Utils.delay 0.2, ->
		articleWrapper.y = header2.y + 140
		articleWrapper.moveIn()
		
	header1.states.switch('inactive')
	header3.states.switch('inactive')
	header4.states.switch('inactive')
	
header3.on Events.Click, ->
	header1.states.switch('inactive')
	header2.states.switch('inactiveUp')
	
	header3.states.switch('active')
	
	header4.states.switch('inactive')
header4.on Events.Click, ->
	header4.states.switch('active')
	
	header1.states.switch('inactive')
	header2.states.switch('inactiveUp')
	header3.states.switch('inactiveUp')