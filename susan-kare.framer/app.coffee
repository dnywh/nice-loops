# This imports all the layers for "watch" into watchLayers
watchLayers = Framer.Importer.load "imported/watch"

# Welcome to Framer
# Learn prototyping at http://framerjs.com/learn

# Create a background
background = new BackgroundLayer backgroundColor: "#fff"

watch = new Layer
	image: 'images/watch.gif'
	width: 272, height: 340