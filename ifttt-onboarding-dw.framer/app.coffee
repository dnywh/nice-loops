background = new BackgroundLayer backgroundColor: "rgba(51, 204, 255, 1)"

# splash screen
splashScreen = new Layer
	x: 0, y:0, width: Screen.width, height: 568*2
	image: "images/LaunchImage.png"
# 	opacity: 0.5
	index: 6
	ignoreEvents: false # disable scrolling or swiping whilst in view
	
# paging scrollview
page = new ScrollComponent
	width: Screen.width, height: Screen.height
	scrollVertical: false, index: 2
	
# pages
amount = 6

# array for page indicators
allIndicators = []

indicatorsContainer = new Layer
	backgroundColor: "transparent"
	width: page.width, height: 12
	x: 0, y: page.height-48
	index: 5
	
# generate indicators (remember amount variable from above)
for i in [0..amount]
	indicator = new Layer
		backgroundColor: "white"
		width: 12, height: 12
		x: 30 * i, y: 0
		borderRadius: "50%", opacity: 0.5
		superLayer: indicatorsContainer
# ?? (changed 9 to 12)
	# stay centered no matter what
	indicator.x += (page.width / 2) - 24 - (12 * amount)
	
	#states
	indicator.states.add
		active: opacity: 1
	indicator.states.animationOptions = 
		time: 0.5
	
	# store indicators in that array we created
	allIndicators.push(indicator)
		
# page 1
	page1 = new Layer
		backgroundColor: "transparent"
		width: page.width, height: screen.width
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


# page 2
page2 = new Layer
	backgroundColor: "transparent"
	width: page.width, height: page.height
	x: page.width
	clip: false
	superLayer: page.content
	
# page 2: content
recipe_marker = new Layer
	x: 25*2, y:90*2,
	width:270*2, height:70*2,
	image:"images/recipe_marker.png"
	superLayer: page2
instagram_to_dropbox = new Layer
	x:17*2, y:168*2, 
	width:285*2, height:132*2,
	image:"images/instagram_to_dropbox.png"
	superLayer: page2
Save_my_Instagram_photos = new Layer
	x:16*2, y:81*2, 
	width:212*2, height:37*2, 
	image:"images/Save_my_Instagram_photos.png"
	superLayer: instagram_to_dropbox
Recipes_are_connections = new Layer
	x:61*2, y:318*2, 
	width:200*2, height:40*2, 
	image:"images/Recipes_are_connections.png"
	superLayer: page2
	
	
	
	
	
	
		
		