Framer.Defaults.Animation = 
	time: 0.2
	curve: 'spring(200, 35, 10)'
		
tabPerspective = 90
tabRotation = -2
tabDepth = -25

tabShadowY = -5
tabShadowBlur = 40
tabShadowColor = "rgba(0,0,0,0.15)"

bg = new BackgroundLayer
	backgroundColor: "black"

# The tab superLayer or 'group' 
rolodex = new Layer
	width: Screen.width, height: Screen.height, clip: false, backgroundColor: "transparent", perspective: tabPerspective
# Enable the rolodex superLayer to be draggable, for the 'scrolling' through the rolodex
rolodex.draggable.enabled = true
rolodex.draggable.horizontal = false
rolodex.draggable.speedY = 0.5
rolodex.draggable.constraints = 
	x: 0, y: 0, width: Screen.width, height: Screen.height

# The rolodex
tab1 = new Layer
	y: 60, height: Screen.height, width: Screen.width, image: "images/tab1.png", superLayer: rolodex
	rotationX: tabRotation, z: tabDepth*1.1
tab1.shadowY = tabShadowY
tab1.shadowBlur = tabShadowBlur
tab1.shadowColor = tabShadowColor

tab2 = new Layer
	y: 480, height: Screen.height, width: Screen.width, image: "images/tab2.png", superLayer: rolodex
	rotationX: tabRotation, z: tabDepth*1.05
tab2.shadowY = tabShadowY
tab2.shadowBlur = tabShadowBlur
tab2.shadowColor = tabShadowColor

tab3 = new Layer
	y: 900, height: Screen.height, width: Screen.width, image: "images/tab3.png", superLayer: rolodex
	rotationX: tabRotation, z: tabDepth
tab3.shadowY = tabShadowY
tab3.shadowBlur = tabShadowBlur
tab3.shadowColor = tabShadowColor
	
triangle1 = new Layer
	maxY: Screen.height-100, width: 84, height: 48
	image: "images/triangle.png", opacity: 0
	superLayer: tab1
triangle1.centerX()

triangle2 = new Layer
	maxY: Screen.height-100, width: 84, height: 48
	image: "images/triangle.png", opacity: 0
	superLayer: tab2
triangle2.centerX()

triangle3 = new Layer
	maxY: Screen.height-100, width: 84, height: 48
	image: "images/triangle.png", opacity: 0
	superLayer: tab3
triangle3.centerX()

tab1.states.add
	active: y: 0, rotationX: 0, z: 0, opacity: 1
	up: y: -Screen.height*1.35, opacity: 0.5
tab2.states.add
	active: y: 0, rotationX: 0, z: 0
	drop: y: Screen.height*1.05, opacity: 0.5
	up: y: -Screen.height*1.35, opacity: 0.5
tab3.states.add
	active: y: 0, rotationX: 0, z: 0
	drop: y: Screen.height*1.05, opacity: 0.5
	
rolodex.on Events.DragMove, ->
	# Add perspective to the rolodex to match the position of the user's drag
	rolodex.animate
		properties: perspective: tabPerspective - (this.y*0.16)
rolodex.on Events.DragEnd, ->
	# Go back to the default perspective (and position)
	rolodex.animate
		properties: perspective: tabPerspective

tab1.on Events.Click, ->
	if rolodex.draggable.isDragging
		# Don't open
	else
		# Do
		if this.states.current is "default"
			rolodex.draggable.enabled = false
			triangle1.opacity = 1
			tab2.states.switch("drop")
			tab3.states.switch("drop")
			this.states.switch("active")
		else if this.states.current is "active"
			rolodex.draggable.enabled = true
			triangle1.opacity = 0
			this.states.switch("default")
			tab2.states.switch("default")
			tab3.states.switch("default")
		
tab2.on Events.Click, ->
	if rolodex.draggable.isDragging
		# Don't open
	else
		# Do
		if this.states.current is "default"
			rolodex.draggable.enabled = false
			triangle2.opacity = 1
			tab1.states.switch("up")
			tab3.states.switch("drop")
			this.states.switch("active")
		else if this.states.current is "active"
			rolodex.draggable.enabled = true
			triangle2.opacity = 0
			this.states.switch("default")
			tab1.states.switch("default")
			tab3.states.switch("default")

tab3.on Events.Click, ->
	if rolodex.draggable.isDragging
		# Don't open
	else
		# Do
		if this.states.current is "default"
			rolodex.draggable.enabled = false
			triangle3.opacity = 1
			tab1.states.switch("up")
			tab2.states.switch("up")
			this.states.switch("active")
		else if this.states.current is "active"
			rolodex.draggable.enabled = true
			triangle3.opacity = 0
			this.states.switch("default")
			tab1.states.switch("default")
			tab2.states.switch("default")