# Add the following line to your project in Framer Studio. 
# myModule = require "myModule"
# Reference the contents by name, like myModule.myFunction() or myModule.myVar
class exports.page1module extends Layer
# page1module.page1push = ->
	# page 1
	page1 = new Layer
		backgroundColor: "transparent"
		width: 640, height: 1334
		x: 0
		superLayer: page.content
		
	# page 1: content
	iphone = new Layer
		y: 82*2
		width:150*2, height:300*2
		image:"images/phone.png"
		superLayer: page1
	iphone.centerX()

	IF_lets_you_create = new Layer
		y:402*2, 
		width:470, height:130,
		image:"images/IF_lets_you_create.png"
		superLayer: page1
	IF_lets_you_create.centerX()

	byIFTTT = new Layer
		y:491*2, 
		width:98*2, height:30*2,
		image:"images/byIFTTT.png"
		superLayer: page1
	byIFTTT.centerX()

	# page 1: content NOT in scrollview
	# adding 55 to the x to account for iPhone 5 to 6 width difference (640-560 = 110. 110/2 = 55)
	instagram = new Layer
		x: 55 + 25*2, y: 199*2, 
		width: 55*2, height: 55*2, 
		image: "images/instagram.png"
		index: 2
	rss_feed = new Layer
		x: 55 + 45*2, y: 264*2, 
		width: 36*2, height: 36*2, 
		image: "images/rss_feed.png"
		index: 1
	weather = new Layer
		x: 55 + 37*2, y: 130*2, 
		width: 62*2, height: 62*2,
		image: "images/weather.png"
		index: 1
	facebook = new Layer
		x: 55 + 241*2, y: 120*2, 
		width: 27*2, height: 27*2,
		image: "images/facebook.png"
		index: 1
	gmail = new Layer
		x: 55 + 270*2, y: 175*2, 
		width: 31*2, height: 23*2,
		image: "images/gmail.png"
		index: 1
	calendar = new Layer
		x: 55 + 203*2, y: 165*2, 
		width: 55*2, height: 50*2, 
		image: "images/icon_calendar.png"
		index: 2
	stocks = new Layer
		x: 55 + 230*2, y: 219*2, 
		width: 61*2, height: 61*2, 
		image: "images/stocks.png"
		index: 1
	soundcloud = new Layer
		x: 55 + 246*2, y: 292*2,
		width: 40*2, height: 40*2, 
		image: "images/soundcloud.png"
		index: 1
