shortcuts = require "shortcuts"

Framer.Defaults.Animation =
	curve: 'spring(300, 25, 0)'

bg = new BackgroundLayer

# This imports all the layers for "automat" into automatLayers
sketch = Framer.Importer.load "imported/automat"

sketch.forwardArrow.opacity = 0
sketch.extra.opacity = 0

sketch.butterheadLettuceDesc.opacity = 0
sketch.arugulaDesc.opacity = 0
sketch.swissChardDesc.opacity = 0

greens = [sketch.butterheadLettuce, sketch.greenLeafLettuce, sketch.basil, sketch.bokChoy, sketch.arugula, sketch.swissChard]

for i in greens
	i.on Events.Click, ->
# 		this.scale = 2

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
			y: -720
	Utils.delay 0.1, ->
		sketch.bucket2.fadeOut()
		sketch.forwardArrow.fadeIn()
	Utils.delay 0.4, ->
		sketch.arugulaDesc.fadeIn()
		
		