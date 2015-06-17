shortcuts = require "shortcuts"

Framer.Defaults.Animation =
	curve: 'spring(300, 25, 0)'

bg = new BackgroundLayer

# This imports all the layers for "automat" into automatLayers
sketch = Framer.Importer.load "imported/automat"

sketch.topBar2.opacity = 0
sketch.forwardArrow.opacity = 0
sketch.extra1.opacity = 0
sketch.extra2.opacity = 0
sketch.extra1small.opacity = 0

sketch.butterheadLettuceDesc.opacity = 0
sketch.arugulaDesc.opacity = 0
sketch.swissChardDesc.opacity = 0
sketch.basilDesc.opacity = 0

greens = [sketch.butterheadLettuce, sketch.greenLeafLettuce, sketch.basil, sketch.bokChoy, sketch.arugula, sketch.swissChard]

sketch.butterheadLettuce.on Events.Click, ->
	this.animate
		properties:
			scale: 0.88
			x: 22
			y: -408
	sketch.desc.fadeOut()
	Utils.delay 0.1, ->
		sketch.bucket1.fadeOut()
		sketch.forwardArrow.fadeIn()
	Utils.delay 0.4, ->
		sketch.butterheadLettuceDesc.fadeIn()

sketch.arugula.on Events.Click, ->
	this.animate
		properties:
			scale: 0.88
# 			x: 162
			y: -408
	sketch.desc.fadeOut()
	Utils.delay 0.1, ->
		sketch.bucket2.fadeOut()
		sketch.forwardArrow.fadeIn()
	Utils.delay 0.4, ->
		sketch.arugulaDesc.fadeIn()
		
sketch.swissChard.on Events.Click, ->
	this.animate
		properties:
			scale: 0.88
			x: 404
			y: -408
	sketch.desc.fadeOut()
	Utils.delay 0.1, ->
		sketch.bucket3.fadeOut()
		sketch.forwardArrow.fadeIn()
	Utils.delay 0.4, ->
		sketch.swissChardDesc.fadeIn()
	Utils.delay 0.6, ->	
		sketch.options.animate
			properties:
				y: 760
		sketch.extra1.fadeIn()
		
sketch.basil.on Events.Click, ->
	this.animate
		properties:
			scale: 0.88
			x: -10
			y: -352
	Utils.delay 0.1, ->
		sketch.extra1.fadeOut()
	Utils.delay 0.4, ->
		sketch.basilDesc.fadeIn()
		sketch.extra2.fadeIn()
		sketch.topBar.fadeOut()
	Utils.delay 0.6, ->
		sketch.topBar2.fadeIn()
	Utils.delay 2.4, ->
		sketch.topBar2.fadeOut()
		sketch.extra1small.fadeIn()
	Utils.delay 2.6, ->
		sketch.topBar.fadeIn()
		
		