require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"shortcuts":[function(require,module,exports){

/*
  Shortcuts for Framer 1.0
  http://github.com/facebook/shortcuts-for-framer

  Copyright (c) 2014, Facebook, Inc.
  All rights reserved.

  Readme:
  https://github.com/facebook/shortcuts-for-framer

  License:
  https://github.com/facebook/shortcuts-for-framer/blob/master/LICENSE.md
 */

/*
  CONFIGURATION
 */
var shortcuts;

shortcuts = {};

Framer.Defaults.FadeAnimation = {
  curve: "bezier-curve",
  time: 0.2
};

Framer.Defaults.SlideAnimation = {
  curve: "spring(400,40,0)"
};


/*
  LOOP ON EVERY LAYER

  Shorthand for applying a function to every layer in the document.

  Example:
  ```shortcuts.everyLayer(function(layer) {
    layer.visible = false;
  });```
 */

shortcuts.everyLayer = function(fn) {
  var _layer, layerName, results1;
  results1 = [];
  for (layerName in window.Layers) {
    _layer = window.Layers[layerName];
    results1.push(fn(_layer));
  }
  return results1;
};


/*
  SHORTHAND FOR ACCESSING LAYERS

  Convert each layer coming from the exporter into a Javascript object for shorthand access.

  This has to be called manually in Framer3 after you've ran the importer.

  myLayers = Framer.Importer.load("...")
  shortcuts.initialize(myLayers)

  If you have a layer in your PSD/Sketch called "NewsFeed", this will create a global Javascript variable called "NewsFeed" that you can manipulate with Framer.

  Example:
  `NewsFeed.visible = false;`

  Notes:
  Javascript has some names reserved for internal function that you can't override (for ex. )
  If you call initialize without anything, it will use all currently available layers.
 */

shortcuts.initialize = function(layers) {
  var layer;
  if (!layers) {
    layer = Framer.CurrentContext._layerList;
  }
  window.Layers = layers;
  return shortcuts.everyLayer(function(layer) {
    var sanitizedLayerName;
    sanitizedLayerName = layer.name.replace(/[-+!?:*\[\]\(\)\/]/g, '').trim().replace(/\s/g, '_');
    window[sanitizedLayerName] = layer;
    shortcuts.saveOriginalFrame(layer);
    return shortcuts.initializeTouchStates(layer);
  });
};


/*
  FIND CHILD LAYERS BY NAME

  Retrieves subLayers of selected layer that have a matching name.

  getChild: return the first sublayer whose name includes the given string
  getChildren: return all subLayers that match

  Useful when eg. iterating over table cells. Use getChild to access the button found in each cell. This is **case insensitive**.

  Example:
  `topLayer = NewsFeed.getChild("Top")` Looks for layers whose name matches Top. Returns the first matching layer.

  `childLayers = Table.getChildren("Cell")` Returns all children whose name match Cell in an array.
 */

Layer.prototype.getChild = function(needle, recursive) {
  var i, j, len, len1, ref, ref1, subLayer;
  if (recursive == null) {
    recursive = false;
  }
  ref = this.subLayers;
  for (i = 0, len = ref.length; i < len; i++) {
    subLayer = ref[i];
    if (subLayer.name.toLowerCase().indexOf(needle.toLowerCase()) !== -1) {
      return subLayer;
    }
  }
  if (recursive) {
    ref1 = this.subLayers;
    for (j = 0, len1 = ref1.length; j < len1; j++) {
      subLayer = ref1[j];
      if (subLayer.getChild(needle, recursive)) {
        return subLayer.getChild(needle, recursive);
      }
    }
  }
};

Layer.prototype.getChildren = function(needle, recursive) {
  var i, j, len, len1, ref, ref1, results, subLayer;
  if (recursive == null) {
    recursive = false;
  }
  results = [];
  if (recursive) {
    ref = this.subLayers;
    for (i = 0, len = ref.length; i < len; i++) {
      subLayer = ref[i];
      results = results.concat(subLayer.getChildren(needle, recursive));
    }
    if (this.name.toLowerCase().indexOf(needle.toLowerCase()) !== -1) {
      results.push(this);
    }
    return results;
  } else {
    ref1 = this.subLayers;
    for (j = 0, len1 = ref1.length; j < len1; j++) {
      subLayer = ref1[j];
      if (subLayer.name.toLowerCase().indexOf(needle.toLowerCase()) !== -1) {
        results.push(subLayer);
      }
    }
    return results;
  }
};


/*
  CONVERT A NUMBER RANGE TO ANOTHER

  Converts a number within one range to another range

  Example:
  We want to map the opacity of a layer to its x location.

  The opacity will be 0 if the X coordinate is 0, and it will be 1 if the X coordinate is 640. All the X coordinates in between will result in intermediate values between 0 and 1.

  `myLayer.opacity = convertRange(0, 640, myLayer.x, 0, 1)`

  By default, this value might be outside the bounds of NewMin and NewMax if the OldValue is outside OldMin and OldMax. If you want to cap the final value to NewMin and NewMax, set capped to true.
  Make sure NewMin is smaller than NewMax if you're using this. If you need an inverse proportion, try swapping OldMin and OldMax.
 */

shortcuts.convertRange = function(OldMin, OldMax, OldValue, NewMin, NewMax, capped) {
  var NewRange, NewValue, OldRange;
  OldRange = OldMax - OldMin;
  NewRange = NewMax - NewMin;
  NewValue = (((OldValue - OldMin) * NewRange) / OldRange) + NewMin;
  if (capped) {
    if (NewValue > NewMax) {
      return NewMax;
    } else if (NewValue < NewMin) {
      return NewMin;
    } else {
      return NewValue;
    }
  } else {
    return NewValue;
  }
};


/*
  ORIGINAL FRAME

  Stores the initial location and size of a layer in the "originalFrame" attribute, so you can revert to it later on.

  Example:
  The x coordinate of MyLayer is initially 400 (from the PSD)

  ```MyLayer.x = 200; // now we set it to 200.
  MyLayer.x = MyLayer.originalFrame.x // now we set it back to its original value, 400.```
 */

shortcuts.saveOriginalFrame = function(layer) {
  return layer.originalFrame = layer.frame;
};


/*
  SHORTHAND HOVER SYNTAX

  Quickly define functions that should run when I hover over a layer, and hover out.

  Example:
  `MyLayer.hover(function() { OtherLayer.show() }, function() { OtherLayer.hide() });`
 */

Layer.prototype.hover = function(enterFunction, leaveFunction) {
  this.on('mouseenter', enterFunction);
  return this.on('mouseleave', leaveFunction);
};


/*
  SHORTHAND TAP SYNTAX

  Instead of `MyLayer.on(Events.TouchEnd, handler)`, use `MyLayer.tap(handler)`
 */

Layer.prototype.tap = function(handler) {
  return this.on(Events.TouchEnd, handler);
};


/*
  SHORTHAND CLICK SYNTAX

  Instead of `MyLayer.on(Events.Click, handler)`, use `MyLayer.click(handler)`
 */

Layer.prototype.click = function(handler) {
  return this.on(Events.Click, handler);
};


/*
  SHORTHAND ANIMATION SYNTAX

  A shorter animation syntax that mirrors the jQuery syntax:
  layer.animate(properties, [time], [curve], [callback])

  All parameters except properties are optional and can be omitted.

  Old:
  ```MyLayer.animate({
    properties: {
      x: 500
    },
    time: 500,
    curve: 'bezier-curve'
  })```

  New:
  ```MyLayer.animateTo({
    x: 500
  })```

  Optionally (with 1000ms duration and spring):
    ```MyLayer.animateTo({
    x: 500
  }, 1000, "spring(100,10,0)")
 */

Layer.prototype.animateTo = function(properties, first, second, third) {
  var callback, curve, thisLayer, time;
  thisLayer = this;
  time = curve = callback = null;
  if (typeof first === "number") {
    time = first;
    if (typeof second === "string") {
      curve = second;
      callback = third;
    }
    if (typeof second === "function") {
      callback = second;
    }
  } else if (typeof first === "string") {
    curve = first;
    if (typeof second === "function") {
      callback = second;
    }
  } else if (typeof first === "function") {
    callback = first;
  }
  if ((time != null) && (curve == null)) {
    curve = 'bezier-curve';
  }
  if (curve == null) {
    curve = Framer.Defaults.Animation.curve;
  }
  if (time == null) {
    time = Framer.Defaults.Animation.time;
  }
  thisLayer.animationTo = new Animation({
    layer: thisLayer,
    properties: properties,
    curve: curve,
    time: time
  });
  thisLayer.animationTo.on('start', function() {
    return thisLayer.isAnimating = true;
  });
  thisLayer.animationTo.on('end', function() {
    thisLayer.isAnimating = null;
    if (callback != null) {
      return callback();
    }
  });
  return thisLayer.animationTo.start();
};


/*
  ANIMATE MOBILE LAYERS IN AND OUT OF THE VIEWPORT

  Shorthand syntax for animating layers in and out of the viewport. Assumes that the layer you are animating is a whole screen and has the same dimensions as your container.

  Enable the device preview in Framer Studio to use this – it lets this script figure out what the bounds of your screen are.

  Example:
  * `MyLayer.slideToLeft()` will animate the layer **to** the left corner of the screen (from its current position)

  * `MyLayer.slideFromLeft()` will animate the layer into the viewport **from** the left corner (from x=-width)

  Configuration:
  * (By default we use a spring curve that approximates iOS. To use a time duration, change the curve to bezier-curve.)
  * Framer.Defaults.SlideAnimation.time
  * Framer.Defaults.SlideAnimation.curve


  How to read the configuration:
  ```slideFromLeft:
    property: "x"     // animate along the X axis
    factor: "width"
    from: -1          // start value: outside the left corner ( x = -width_phone )
    to: 0             // end value: inside the left corner ( x = width_layer )
  ```
 */

shortcuts.slideAnimations = {
  slideFromLeft: {
    property: "x",
    factor: "width",
    from: -1,
    to: 0
  },
  slideToLeft: {
    property: "x",
    factor: "width",
    to: -1
  },
  slideFromRight: {
    property: "x",
    factor: "width",
    from: 1,
    to: 0
  },
  slideToRight: {
    property: "x",
    factor: "width",
    to: 1
  },
  slideFromTop: {
    property: "y",
    factor: "height",
    from: -1,
    to: 0
  },
  slideToTop: {
    property: "y",
    factor: "height",
    to: -1
  },
  slideFromBottom: {
    property: "y",
    factor: "height",
    from: 1,
    to: 0
  },
  slideToBottom: {
    property: "y",
    factor: "height",
    to: 1
  }
};

_.each(shortcuts.slideAnimations, function(opts, name) {
  return Layer.prototype[name] = function(time) {
    var _animationConfig, _curve, _factor, _phone, _property, _time, err, ref, ref1;
    _phone = (ref = Framer.Device) != null ? (ref1 = ref.screen) != null ? ref1.frame : void 0 : void 0;
    if (!_phone) {
      err = "Please select a device preview in Framer Studio to use the slide preset animations.";
      print(err);
      console.log(err);
      return;
    }
    _property = opts.property;
    _factor = _phone[opts.factor];
    if (opts.from != null) {
      this[_property] = opts.from * _factor;
    }
    _animationConfig = {};
    _animationConfig[_property] = opts.to * _factor;
    if (time) {
      _time = time;
      _curve = "bezier-curve";
    } else {
      _time = Framer.Defaults.SlideAnimation.time;
      _curve = Framer.Defaults.SlideAnimation.curve;
    }
    return this.animate({
      properties: _animationConfig,
      time: _time,
      curve: _curve
    });
  };
});


/*
  EASY FADE IN / FADE OUT

  .show() and .hide() are shortcuts to affect opacity and pointer events. This is essentially the same as hiding with `visible = false` but can be animated.

  .fadeIn() and .fadeOut() are shortcuts to fade in a hidden layer, or fade out a visible layer.

  These shortcuts work on individual layer objects as well as an array of layers.

  Example:
  * `MyLayer.fadeIn()` will fade in MyLayer using default timing.
  * `[MyLayer, OtherLayer].fadeOut(4)` will fade out both MyLayer and OtherLayer over 4 seconds.

  To customize the fade animation, change the variables time and curve inside `Framer.Defaults.FadeAnimation`.
 */

Layer.prototype.show = function() {
  this.opacity = 1;
  this.style.pointerEvents = 'auto';
  return this;
};

Layer.prototype.hide = function() {
  this.opacity = 0;
  this.style.pointerEvents = 'none';
  return this;
};

Layer.prototype.fadeIn = function(time) {
  if (time == null) {
    time = Framer.Defaults.FadeAnimation.time;
  }
  if (this.opacity === 1) {
    return;
  }
  if (!this.visible) {
    this.opacity = 0;
    this.visible = true;
  }
  return this.animateTo({
    opacity: 1
  }, time, Framer.Defaults.FadeAnimation.curve);
};

Layer.prototype.fadeOut = function(time) {
  var that;
  if (time == null) {
    time = Framer.Defaults.FadeAnimation.time;
  }
  if (this.opacity === 0) {
    return;
  }
  that = this;
  return this.animateTo({
    opacity: 0
  }, time, Framer.Defaults.FadeAnimation.curve, function() {
    return that.style.pointerEvents = 'none';
  });
};

_.each(['show', 'hide', 'fadeIn', 'fadeOut'], function(fnString) {
  return Object.defineProperty(Array.prototype, fnString, {
    enumerable: false,
    value: function(time) {
      _.each(this, function(layer) {
        if (layer instanceof Layer) {
          return Layer.prototype[fnString].call(layer, time);
        }
      });
      return this;
    }
  });
});


/*
  EASY HOVER AND TOUCH/CLICK STATES FOR LAYERS

  By naming your layer hierarchy in the following way, you can automatically have your layers react to hovers, clicks or taps.

  Button_touchable
  - Button_default (default state)
  - Button_down (touch/click state)
  - Button_hover (hover)
 */

shortcuts.initializeTouchStates = function(layer) {
  var _default, _down, _hover, hitTarget;
  _default = layer.getChild('default');
  if (layer.name.toLowerCase().indexOf('touchable') && _default) {
    if (!Framer.Utils.isMobile()) {
      _hover = layer.getChild('hover');
    }
    _down = layer.getChild('down');
    if (_hover != null) {
      _hover.hide();
    }
    if (_down != null) {
      _down.hide();
    }
    if (_hover || _down) {
      hitTarget = new Layer({
        background: 'transparent',
        frame: _default.frame
      });
      hitTarget.superLayer = layer;
      hitTarget.bringToFront();
    }
    if (_hover) {
      layer.hover(function() {
        _default.hide();
        return _hover.show();
      }, function() {
        _default.show();
        return _hover.hide();
      });
    }
    if (_down) {
      layer.on(Events.TouchStart, function() {
        _default.hide();
        if (_hover != null) {
          _hover.hide();
        }
        return _down.show();
      });
      return layer.on(Events.TouchEnd, function() {
        _down.hide();
        if (_hover) {
          return _hover.show();
        } else {
          return _default.show();
        }
      });
    }
  }
};

_.extend(exports, shortcuts);



},{}]},{},[])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvZGFuaWVsL0dpdGh1Yi9uaWNlLWxvb3BzL2xvb3AtbGltaXRzLmZyYW1lci9tb2R1bGVzL3Nob3J0Y3V0cy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUFBOzs7Ozs7Ozs7Ozs7R0FBQTtBQWlCQTtBQUFBOztHQWpCQTtBQUFBLElBQUEsU0FBQTs7QUFBQSxTQXFCQSxHQUFZLEVBckJaLENBQUE7O0FBQUEsTUF1Qk0sQ0FBQyxRQUFRLENBQUMsYUFBaEIsR0FDRTtBQUFBLEVBQUEsS0FBQSxFQUFPLGNBQVA7QUFBQSxFQUNBLElBQUEsRUFBTSxHQUROO0NBeEJGLENBQUE7O0FBQUEsTUEyQk0sQ0FBQyxRQUFRLENBQUMsY0FBaEIsR0FDRTtBQUFBLEVBQUEsS0FBQSxFQUFPLGtCQUFQO0NBNUJGLENBQUE7O0FBZ0NBO0FBQUE7Ozs7Ozs7OztHQWhDQTs7QUFBQSxTQTBDUyxDQUFDLFVBQVYsR0FBdUIsU0FBQyxFQUFELEdBQUE7QUFDckIsTUFBQSwyQkFBQTtBQUFBO09BQUEsMEJBQUEsR0FBQTtBQUNFLElBQUEsTUFBQSxHQUFTLE1BQU0sQ0FBQyxNQUFPLENBQUEsU0FBQSxDQUF2QixDQUFBO0FBQUEsa0JBQ0EsRUFBQSxDQUFHLE1BQUgsRUFEQSxDQURGO0FBQUE7a0JBRHFCO0FBQUEsQ0ExQ3ZCLENBQUE7O0FBZ0RBO0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQWhEQTs7QUFBQSxTQW1FUyxDQUFDLFVBQVYsR0FBdUIsU0FBQyxNQUFELEdBQUE7QUFFckIsTUFBQSxLQUFBO0FBQUEsRUFBQSxJQUE0QyxDQUFBLE1BQTVDO0FBQUEsSUFBQSxLQUFBLEdBQVEsTUFBTSxDQUFDLGNBQWMsQ0FBQyxVQUE5QixDQUFBO0dBQUE7QUFBQSxFQUVBLE1BQU0sQ0FBQyxNQUFQLEdBQWdCLE1BRmhCLENB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QU4sQ0FBQSxFQUgwQjtNQUFBLENBQTVCLENBQUEsQ0FBQTthQUtBLEtBQUssQ0FBQyxFQUFOLENBQVMsTUFBTSxDQUFDLFFBQWhCLEVBQTBCLFNBQUEsR0FBQTtBQUN4QixRQUFBLEtBQUssQ0FBQyxJQUFOLENBQUEsQ0FBQSxDQUFBO0FBRUEsUUFBQSxJQUFHLE1BQUg7aUJBRUUsTUFBTSxDQUFDLElBQVAsQ0FBQSxFQUZGO1NBQUEsTUFBQTtpQkFJRSxRQUFRLENBQUMsSUFBVCxDQUFBLEVBSkY7U0FId0I7TUFBQSxDQUExQixFQU5GO0tBN0JGO0dBSGdDO0FBQUEsQ0F6YmxDLENBQUE7O0FBQUEsQ0F5ZUMsQ0FBQyxNQUFGLENBQVMsT0FBVCxFQUFrQixTQUFsQixDQXplQSxDQUFBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIiMjI1xuICBTaG9ydGN1dHMgZm9yIEZyYW1lciAxLjBcbiAgaHR0cDovL2dpdGh1Yi5jb20vZmFjZWJvb2svc2hvcnRjdXRzLWZvci1mcmFtZXJcblxuICBDb3B5cmlnaHQgKGMpIDIwMTQsIEZhY2Vib29rLCBJbmMuXG4gIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG5cbiAgUmVhZG1lOlxuICBodHRwczovL2dpdGh1Yi5jb20vZmFjZWJvb2svc2hvcnRjdXRzLWZvci1mcmFtZXJcblxuICBMaWNlbnNlOlxuICBodHRwczovL2dpdGh1Yi5jb20vZmFjZWJvb2svc2hvcnRjdXRzLWZvci1mcmFtZXIvYmxvYi9tYXN0ZXIvTElDRU5TRS5tZFxuIyMjXG5cblxuXG5cbiMjI1xuICBDT05GSUdVUkFUSU9OXG4jIyNcblxuc2hvcnRjdXRzID0ge31cblxuRnJhbWVyLkRlZmF1bHRzLkZhZGVBbmltYXRpb24gPVxuICBjdXJ2ZTogXCJiZXppZXItY3VydmVcIlxuICB0aW1lOiAwLjJcblxuRnJhbWVyLkRlZmF1bHRzLlNsaWRlQW5pbWF0aW9uID1cbiAgY3VydmU6IFwic3ByaW5nKDQwMCw0MCwwKVwiXG5cblxuXG4jIyNcbiAgTE9PUCBPTiBFVkVSWSBMQVlFUlxuXG4gIFNob3J0aGFuZCBmb3IgYXBwbHlpbmcgYSBmdW5jdGlvbiB0byBldmVyeSBsYXllciBpbiB0aGUgZG9jdW1lbnQuXG5cbiAgRXhhbXBsZTpcbiAgYGBgc2hvcnRjdXRzLmV2ZXJ5TGF5ZXIoZnVuY3Rpb24obGF5ZXIpIHtcbiAgICBsYXllci52aXNpYmxlID0gZmFsc2U7XG4gIH0pO2BgYFxuIyMjXG5zaG9ydGN1dHMuZXZlcnlMYXllciA9IChmbikgLT5cbiAgZm9yIGxheWVyTmFtZSBvZiB3aW5kb3cuTGF5ZXJzXG4gICAgX2xheWVyID0gd2luZG93LkxheWVyc1tsYXllck5hbWVdXG4gICAgZm4gX2xheWVyXG5cblxuIyMjXG4gIFNIT1JUSEFORCBGT1IgQUNDRVNTSU5HIExBWUVSU1xuXG4gIENvbnZlcnQgZWFjaCBsYXllciBjb21pbmcgZnJvbSB0aGUgZXhwb3J0ZXIgaW50byBhIEphdmFzY3JpcHQgb2JqZWN0IGZvciBzaG9ydGhhbmQgYWNjZXNzLlxuXG4gIFRoaXMgaGFzIHRvIGJlIGNhbGxlZCBtYW51YWxseSBpbiBGcmFtZXIzIGFmdGVyIHlvdSd2ZSByYW4gdGhlIGltcG9ydGVyLlxuXG4gIG15TGF5ZXJzID0gRnJhbWVyLkltcG9ydGVyLmxvYWQoXCIuLi5cIilcbiAgc2hvcnRjdXRzLmluaXRpYWxpemUobXlMYXllcnMpXG5cbiAgSWYgeW91IGhhdmUgYSBsYXllciBpbiB5b3VyIFBTRC9Ta2V0Y2ggY2FsbGVkIFwiTmV3c0ZlZWRcIiwgdGhpcyB3aWxsIGNyZWF0ZSBhIGdsb2JhbCBKYXZhc2NyaXB0IHZhcmlhYmxlIGNhbGxlZCBcIk5ld3NGZWVkXCIgdGhhdCB5b3UgY2FuIG1hbmlwdWxhdGUgd2l0aCBGcmFtZXIuXG5cbiAgRXhhbXBsZTpcbiAgYE5ld3NGZWVkLnZpc2libGUgPSBmYWxzZTtgXG5cbiAgTm90ZXM6XG4gIEphdmFzY3JpcHQgaGFzIHNvbWUgbmFtZXMgcmVzZXJ2ZWQgZm9yIGludGVybmFsIGZ1bmN0aW9uIHRoYXQgeW91IGNhbid0IG92ZXJyaWRlIChmb3IgZXguIClcbiAgSWYgeW91IGNhbGwgaW5pdGlhbGl6ZSB3aXRob3V0IGFueXRoaW5nLCBpdCB3aWxsIHVzZSBhbGwgY3VycmVudGx5IGF2YWlsYWJsZSBsYXllcnMuXG4jIyNcbnNob3J0Y3V0cy5pbml0aWFsaXplID0gKGxheWVycykgLT5cblxuICBsYXllciA9IEZyYW1lci5DdXJyZW50Q29udGV4dC5fbGF5ZXJMaXN0IGlmIG5vdCBsYXllcnNcblxuICB3aW5kb3cuTGF5ZXJzID0gbGF5ZXJzXG5cbiAgc2hvcnRjdXRzLmV2ZXJ5TGF5ZXIgKGxheWVyKSAtPlxuICAgIHNhbml0aXplZExheWVyTmFtZSA9IGxheWVyLm5hbWUucmVwbGFjZSgvWy0rIT86KlxcW1xcXVxcKFxcKVxcL10vZywgJycpLnRyaW0oKS5yZXBsYWNlKC9cXHMvZywgJ18nKVxuICAgIHdpbmRvd1tzYW5pdGl6ZWRMYXllck5hbWVdID0gbGF5ZXJcbiAgICBzaG9ydGN1dHMuc2F2ZU9yaWdpbmFsRnJhbWUgbGF5ZXJcbiAgICBzaG9ydGN1dHMuaW5pdGlhbGl6ZVRvdWNoU3RhdGVzIGxheWVyXG5cblxuIyMjXG4gIEZJTkQgQ0hJTEQgTEFZRVJTIEJZIE5BTUVcblxuICBSZXRyaWV2ZXMgc3ViTGF5ZXJzIG9mIHNlbGVjdGVkIGxheWVyIHRoYXQgaGF2ZSBhIG1hdGNoaW5nIG5hbWUuXG5cbiAgZ2V0Q2hpbGQ6IHJldHVybiB0aGUgZmlyc3Qgc3VibGF5ZXIgd2hvc2UgbmFtZSBpbmNsdWRlcyB0aGUgZ2l2ZW4gc3RyaW5nXG4gIGdldENoaWxkcmVuOiByZXR1cm4gYWxsIHN1YkxheWVycyB0aGF0IG1hdGNoXG5cbiAgVXNlZnVsIHdoZW4gZWcuIGl0ZXJhdGluZyBvdmVyIHRhYmxlIGNlbGxzLiBVc2UgZ2V0Q2hpbGQgdG8gYWNjZXNzIHRoZSBidXR0b24gZm91bmQgaW4gZWFjaCBjZWxsLiBUaGlzIGlzICoqY2FzZSBpbnNlbnNpdGl2ZSoqLlxuXG4gIEV4YW1wbGU6XG4gIGB0b3BMYXllciA9IE5ld3NGZWVkLmdldENoaWxkKFwiVG9wXCIpYCBMb29rcyBmb3IgbGF5ZXJzIHdob3NlIG5hbWUgbWF0Y2hlcyBUb3AuIFJldHVybnMgdGhlIGZpcnN0IG1hdGNoaW5nIGxheWVyLlxuXG4gIGBjaGlsZExheWVycyA9IFRhYmxlLmdldENoaWxkcmVuKFwiQ2VsbFwiKWAgUmV0dXJucyBhbGwgY2hpbGRyZW4gd2hvc2UgbmFtZSBtYXRjaCBDZWxsIGluIGFuIGFycmF5LlxuIyMjXG5MYXllcjo6Z2V0Q2hpbGQgPSAobmVlZGxlLCByZWN1cnNpdmUgPSBmYWxzZSkgLT5cbiAgIyBTZWFyY2ggZGlyZWN0IGNoaWxkcmVuXG4gIGZvciBzdWJMYXllciBpbiBAc3ViTGF5ZXJzXG4gICAgcmV0dXJuIHN1YkxheWVyIGlmIHN1YkxheWVyLm5hbWUudG9Mb3dlckNhc2UoKS5pbmRleE9mKG5lZWRsZS50b0xvd2VyQ2FzZSgpKSBpc250IC0xIFxuXG4gICMgUmVjdXJzaXZlbHkgc2VhcmNoIGNoaWxkcmVuIG9mIGNoaWxkcmVuXG4gIGlmIHJlY3Vyc2l2ZVxuICAgIGZvciBzdWJMYXllciBpbiBAc3ViTGF5ZXJzXG4gICAgICByZXR1cm4gc3ViTGF5ZXIuZ2V0Q2hpbGQobmVlZGxlLCByZWN1cnNpdmUpIGlmIHN1YkxheWVyLmdldENoaWxkKG5lZWRsZSwgcmVjdXJzaXZlKSBcblxuXG5MYXllcjo6Z2V0Q2hpbGRyZW4gPSAobmVlZGxlLCByZWN1cnNpdmUgPSBmYWxzZSkgLT5cbiAgcmVzdWx0cyA9IFtdXG5cbiAgaWYgcmVjdXJzaXZlXG4gICAgZm9yIHN1YkxheWVyIGluIEBzdWJMYXllcnNcbiAgICAgIHJlc3VsdHMgPSByZXN1bHRzLmNvbmNhdCBzdWJMYXllci5nZXRDaGlsZHJlbihuZWVkbGUsIHJlY3Vyc2l2ZSlcbiAgICByZXN1bHRzLnB1c2ggQCBpZiBAbmFtZS50b0xvd2VyQ2FzZSgpLmluZGV4T2YobmVlZGxlLnRvTG93ZXJDYXNlKCkpIGlzbnQgLTFcbiAgICByZXR1cm4gcmVzdWx0c1xuXG4gIGVsc2VcbiAgICBmb3Igc3ViTGF5ZXIgaW4gQHN1YkxheWVyc1xuICAgICAgaWYgc3ViTGF5ZXIubmFtZS50b0xvd2VyQ2FzZSgpLmluZGV4T2YobmVlZGxlLnRvTG93ZXJDYXNlKCkpIGlzbnQgLTEgXG4gICAgICAgIHJlc3VsdHMucHVzaCBzdWJMYXllciBcbiAgICByZXR1cm4gcmVzdWx0c1xuXG5cblxuIyMjXG4gIENPTlZFUlQgQSBOVU1CRVIgUkFOR0UgVE8gQU5PVEhFUlxuXG4gIENvbnZlcnRzIGEgbnVtYmVyIHdpdGhpbiBvbmUgcmFuZ2UgdG8gYW5vdGhlciByYW5nZVxuXG4gIEV4YW1wbGU6XG4gIFdlIHdhbnQgdG8gbWFwIHRoZSBvcGFjaXR5IG9mIGEgbGF5ZXIgdG8gaXRzIHggbG9jYXRpb24uXG5cbiAgVGhlIG9wYWNpdHkgd2lsbCBiZSAwIGlmIHRoZSBYIGNvb3JkaW5hdGUgaXMgMCwgYW5kIGl0IHdpbGwgYmUgMSBpZiB0aGUgWCBjb29yZGluYXRlIGlzIDY0MC4gQWxsIHRoZSBYIGNvb3JkaW5hdGVzIGluIGJldHdlZW4gd2lsbCByZXN1bHQgaW4gaW50ZXJtZWRpYXRlIHZhbHVlcyBiZXR3ZWVuIDAgYW5kIDEuXG5cbiAgYG15TGF5ZXIub3BhY2l0eSA9IGNvbnZlcnRSYW5nZSgwLCA2NDAsIG15TGF5ZXIueCwgMCwgMSlgXG5cbiAgQnkgZGVmYXVsdCwgdGhpcyB2YWx1ZSBtaWdodCBiZSBvdXRzaWRlIHRoZSBib3VuZHMgb2YgTmV3TWluIGFuZCBOZXdNYXggaWYgdGhlIE9sZFZhbHVlIGlzIG91dHNpZGUgT2xkTWluIGFuZCBPbGRNYXguIElmIHlvdSB3YW50IHRvIGNhcCB0aGUgZmluYWwgdmFsdWUgdG8gTmV3TWluIGFuZCBOZXdNYXgsIHNldCBjYXBwZWQgdG8gdHJ1ZS5cbiAgTWFrZSBzdXJlIE5ld01pbiBpcyBzbWFsbGVyIHRoYW4gTmV3TWF4IGlmIHlvdSdyZSB1c2luZyB0aGlzLiBJZiB5b3UgbmVlZCBhbiBpbnZlcnNlIHByb3BvcnRpb24sIHRyeSBzd2FwcGluZyBPbGRNaW4gYW5kIE9sZE1heC5cbiMjI1xuc2hvcnRjdXRzLmNvbnZlcnRSYW5nZSA9IChPbGRNaW4sIE9sZE1heCwgT2xkVmFsdWUsIE5ld01pbiwgTmV3TWF4LCBjYXBwZWQpIC0+XG4gIE9sZFJhbmdlID0gKE9sZE1heCAtIE9sZE1pbilcbiAgTmV3UmFuZ2UgPSAoTmV3TWF4IC0gTmV3TWluKVxuICBOZXdWYWx1ZSA9ICgoKE9sZFZhbHVlIC0gT2xkTWluKSAqIE5ld1JhbmdlKSAvIE9sZFJhbmdlKSArIE5ld01pblxuXG4gIGlmIGNhcHBlZFxuICAgIGlmIE5ld1ZhbHVlID4gTmV3TWF4XG4gICAgICBOZXdNYXhcbiAgICBlbHNlIGlmIE5ld1ZhbHVlIDwgTmV3TWluXG4gICAgICBOZXdNaW5cbiAgICBlbHNlXG4gICAgICBOZXdWYWx1ZVxuICBlbHNlXG4gICAgTmV3VmFsdWVcblxuXG4jIyNcbiAgT1JJR0lOQUwgRlJBTUVcblxuICBTdG9yZXMgdGhlIGluaXRpYWwgbG9jYXRpb24gYW5kIHNpemUgb2YgYSBsYXllciBpbiB0aGUgXCJvcmlnaW5hbEZyYW1lXCIgYXR0cmlidXRlLCBzbyB5b3UgY2FuIHJldmVydCB0byBpdCBsYXRlciBvbi5cblxuICBFeGFtcGxlOlxuICBUaGUgeCBjb29yZGluYXRlIG9mIE15TGF5ZXIgaXMgaW5pdGlhbGx5IDQwMCAoZnJvbSB0aGUgUFNEKVxuXG4gIGBgYE15TGF5ZXIueCA9IDIwMDsgLy8gbm93IHdlIHNldCBpdCB0byAyMDAuXG4gIE15TGF5ZXIueCA9IE15TGF5ZXIub3JpZ2luYWxGcmFtZS54IC8vIG5vdyB3ZSBzZXQgaXQgYmFjayB0byBpdHMgb3JpZ2luYWwgdmFsdWUsIDQwMC5gYGBcbiMjI1xuc2hvcnRjdXRzLnNhdmVPcmlnaW5hbEZyYW1lID0gKGxheWVyKSAtPlxuICBsYXllci5vcmlnaW5hbEZyYW1lID0gbGF5ZXIuZnJhbWVcblxuIyMjXG4gIFNIT1JUSEFORCBIT1ZFUiBTWU5UQVhcblxuICBRdWlja2x5IGRlZmluZSBmdW5jdGlvbnMgdGhhdCBzaG91bGQgcnVuIHdoZW4gSSBob3ZlciBvdmVyIGEgbGF5ZXIsIGFuZCBob3ZlciBvdXQuXG5cbiAgRXhhbXBsZTpcbiAgYE15TGF5ZXIuaG92ZXIoZnVuY3Rpb24oKSB7IE90aGVyTGF5ZXIuc2hvdygpIH0sIGZ1bmN0aW9uKCkgeyBPdGhlckxheWVyLmhpZGUoKSB9KTtgXG4jIyNcbkxheWVyOjpob3ZlciA9IChlbnRlckZ1bmN0aW9uLCBsZWF2ZUZ1bmN0aW9uKSAtPlxuICB0aGlzLm9uICdtb3VzZWVudGVyJywgZW50ZXJGdW5jdGlvblxuICB0aGlzLm9uICdtb3VzZWxlYXZlJywgbGVhdmVGdW5jdGlvblxuXG5cbiMjI1xuICBTSE9SVEhBTkQgVEFQIFNZTlRBWFxuXG4gIEluc3RlYWQgb2YgYE15TGF5ZXIub24oRXZlbnRzLlRvdWNoRW5kLCBoYW5kbGVyKWAsIHVzZSBgTXlMYXllci50YXAoaGFuZGxlcilgXG4jIyNcblxuTGF5ZXI6OnRhcCA9IChoYW5kbGVyKSAtPlxuICB0aGlzLm9uIEV2ZW50cy5Ub3VjaEVuZCwgaGFuZGxlclxuXG5cbiMjI1xuICBTSE9SVEhBTkQgQ0xJQ0sgU1lOVEFYXG5cbiAgSW5zdGVhZCBvZiBgTXlMYXllci5vbihFdmVudHMuQ2xpY2ssIGhhbmRsZXIpYCwgdXNlIGBNeUxheWVyLmNsaWNrKGhhbmRsZXIpYFxuIyMjXG5cbkxheWVyOjpjbGljayA9IChoYW5kbGVyKSAtPlxuICB0aGlzLm9uIEV2ZW50cy5DbGljaywgaGFuZGxlclxuXG5cblxuIyMjXG4gIFNIT1JUSEFORCBBTklNQVRJT04gU1lOVEFYXG5cbiAgQSBzaG9ydGVyIGFuaW1hdGlvbiBzeW50YXggdGhhdCBtaXJyb3JzIHRoZSBqUXVlcnkgc3ludGF4OlxuICBsYXllci5hbmltYXRlKHByb3BlcnRpZXMsIFt0aW1lXSwgW2N1cnZlXSwgW2NhbGxiYWNrXSlcblxuICBBbGwgcGFyYW1ldGVycyBleGNlcHQgcHJvcGVydGllcyBhcmUgb3B0aW9uYWwgYW5kIGNhbiBiZSBvbWl0dGVkLlxuXG4gIE9sZDpcbiAgYGBgTXlMYXllci5hbmltYXRlKHtcbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICB4OiA1MDBcbiAgICB9LFxuICAgIHRpbWU6IDUwMCxcbiAgICBjdXJ2ZTogJ2Jlemllci1jdXJ2ZSdcbiAgfSlgYGBcblxuICBOZXc6XG4gIGBgYE15TGF5ZXIuYW5pbWF0ZVRvKHtcbiAgICB4OiA1MDBcbiAgfSlgYGBcblxuICBPcHRpb25hbGx5ICh3aXRoIDEwMDBtcyBkdXJhdGlvbiBhbmQgc3ByaW5nKTpcbiAgICBgYGBNeUxheWVyLmFuaW1hdGVUbyh7XG4gICAgeDogNTAwXG4gIH0sIDEwMDAsIFwic3ByaW5nKDEwMCwxMCwwKVwiKVxuIyMjXG5cblxuXG5MYXllcjo6YW5pbWF0ZVRvID0gKHByb3BlcnRpZXMsIGZpcnN0LCBzZWNvbmQsIHRoaXJkKSAtPlxuICB0aGlzTGF5ZXIgPSB0aGlzXG4gIHRpbWUgPSBjdXJ2ZSA9IGNhbGxiYWNrID0gbnVsbFxuXG4gIGlmIHR5cGVvZihmaXJzdCkgPT0gXCJudW1iZXJcIlxuICAgIHRpbWUgPSBmaXJzdFxuICAgIGlmIHR5cGVvZihzZWNvbmQpID09IFwic3RyaW5nXCJcbiAgICAgIGN1cnZlID0gc2Vjb25kXG4gICAgICBjYWxsYmFjayA9IHRoaXJkXG4gICAgY2FsbGJhY2sgPSBzZWNvbmQgaWYgdHlwZW9mKHNlY29uZCkgPT0gXCJmdW5jdGlvblwiXG4gIGVsc2UgaWYgdHlwZW9mKGZpcnN0KSA9PSBcInN0cmluZ1wiXG4gICAgY3VydmUgPSBmaXJzdFxuICAgIGNhbGxiYWNrID0gc2Vjb25kIGlmIHR5cGVvZihzZWNvbmQpID09IFwiZnVuY3Rpb25cIlxuICBlbHNlIGlmIHR5cGVvZihmaXJzdCkgPT0gXCJmdW5jdGlvblwiXG4gICAgY2FsbGJhY2sgPSBmaXJzdFxuXG4gIGlmIHRpbWU/ICYmICFjdXJ2ZT9cbiAgICBjdXJ2ZSA9ICdiZXppZXItY3VydmUnXG4gIFxuICBjdXJ2ZSA9IEZyYW1lci5EZWZhdWx0cy5BbmltYXRpb24uY3VydmUgaWYgIWN1cnZlP1xuICB0aW1lID0gRnJhbWVyLkRlZmF1bHRzLkFuaW1hdGlvbi50aW1lIGlmICF0aW1lP1xuXG4gIHRoaXNMYXllci5hbmltYXRpb25UbyA9IG5ldyBBbmltYXRpb25cbiAgICBsYXllcjogdGhpc0xheWVyXG4gICAgcHJvcGVydGllczogcHJvcGVydGllc1xuICAgIGN1cnZlOiBjdXJ2ZVxuICAgIHRpbWU6IHRpbWVcblxuICB0aGlzTGF5ZXIuYW5pbWF0aW9uVG8ub24gJ3N0YXJ0JywgLT5cbiAgICB0aGlzTGF5ZXIuaXNBbmltYXRpbmcgPSB0cnVlXG5cbiAgdGhpc0xheWVyLmFuaW1hdGlvblRvLm9uICdlbmQnLCAtPlxuICAgIHRoaXNMYXllci5pc0FuaW1hdGluZyA9IG51bGxcbiAgICBpZiBjYWxsYmFjaz9cbiAgICAgIGNhbGxiYWNrKClcblxuICB0aGlzTGF5ZXIuYW5pbWF0aW9uVG8uc3RhcnQoKVxuXG4jIyNcbiAgQU5JTUFURSBNT0JJTEUgTEFZRVJTIElOIEFORCBPVVQgT0YgVEhFIFZJRVdQT1JUXG5cbiAgU2hvcnRoYW5kIHN5bnRheCBmb3IgYW5pbWF0aW5nIGxheWVycyBpbiBhbmQgb3V0IG9mIHRoZSB2aWV3cG9ydC4gQXNzdW1lcyB0aGF0IHRoZSBsYXllciB5b3UgYXJlIGFuaW1hdGluZyBpcyBhIHdob2xlIHNjcmVlbiBhbmQgaGFzIHRoZSBzYW1lIGRpbWVuc2lvbnMgYXMgeW91ciBjb250YWluZXIuXG5cbiAgRW5hYmxlIHRoZSBkZXZpY2UgcHJldmlldyBpbiBGcmFtZXIgU3R1ZGlvIHRvIHVzZSB0aGlzIOKAk8KgaXQgbGV0cyB0aGlzIHNjcmlwdCBmaWd1cmUgb3V0IHdoYXQgdGhlIGJvdW5kcyBvZiB5b3VyIHNjcmVlbiBhcmUuXG5cbiAgRXhhbXBsZTpcbiAgKiBgTXlMYXllci5zbGlkZVRvTGVmdCgpYCB3aWxsIGFuaW1hdGUgdGhlIGxheWVyICoqdG8qKiB0aGUgbGVmdCBjb3JuZXIgb2YgdGhlIHNjcmVlbiAoZnJvbSBpdHMgY3VycmVudCBwb3NpdGlvbilcblxuICAqIGBNeUxheWVyLnNsaWRlRnJvbUxlZnQoKWAgd2lsbCBhbmltYXRlIHRoZSBsYXllciBpbnRvIHRoZSB2aWV3cG9ydCAqKmZyb20qKiB0aGUgbGVmdCBjb3JuZXIgKGZyb20geD0td2lkdGgpXG5cbiAgQ29uZmlndXJhdGlvbjpcbiAgKiAoQnkgZGVmYXVsdCB3ZSB1c2UgYSBzcHJpbmcgY3VydmUgdGhhdCBhcHByb3hpbWF0ZXMgaU9TLiBUbyB1c2UgYSB0aW1lIGR1cmF0aW9uLCBjaGFuZ2UgdGhlIGN1cnZlIHRvIGJlemllci1jdXJ2ZS4pXG4gICogRnJhbWVyLkRlZmF1bHRzLlNsaWRlQW5pbWF0aW9uLnRpbWVcbiAgKiBGcmFtZXIuRGVmYXVsdHMuU2xpZGVBbmltYXRpb24uY3VydmVcblxuXG4gIEhvdyB0byByZWFkIHRoZSBjb25maWd1cmF0aW9uOlxuICBgYGBzbGlkZUZyb21MZWZ0OlxuICAgIHByb3BlcnR5OiBcInhcIiAgICAgLy8gYW5pbWF0ZSBhbG9uZyB0aGUgWCBheGlzXG4gICAgZmFjdG9yOiBcIndpZHRoXCJcbiAgICBmcm9tOiAtMSAgICAgICAgICAvLyBzdGFydCB2YWx1ZTogb3V0c2lkZSB0aGUgbGVmdCBjb3JuZXIgKCB4ID0gLXdpZHRoX3Bob25lIClcbiAgICB0bzogMCAgICAgICAgICAgICAvLyBlbmQgdmFsdWU6IGluc2lkZSB0aGUgbGVmdCBjb3JuZXIgKCB4ID0gd2lkdGhfbGF5ZXIgKVxuICBgYGBcbiMjI1xuXG5cbnNob3J0Y3V0cy5zbGlkZUFuaW1hdGlvbnMgPVxuICBzbGlkZUZyb21MZWZ0OlxuICAgIHByb3BlcnR5OiBcInhcIlxuICAgIGZhY3RvcjogXCJ3aWR0aFwiXG4gICAgZnJvbTogLTFcbiAgICB0bzogMFxuXG4gIHNsaWRlVG9MZWZ0OlxuICAgIHByb3BlcnR5OiBcInhcIlxuICAgIGZhY3RvcjogXCJ3aWR0aFwiXG4gICAgdG86IC0xXG5cbiAgc2xpZGVGcm9tUmlnaHQ6XG4gICAgcHJvcGVydHk6IFwieFwiXG4gICAgZmFjdG9yOiBcIndpZHRoXCJcbiAgICBmcm9tOiAxXG4gICAgdG86IDBcblxuICBzbGlkZVRvUmlnaHQ6XG4gICAgcHJvcGVydHk6IFwieFwiXG4gICAgZmFjdG9yOiBcIndpZHRoXCJcbiAgICB0bzogMVxuXG4gIHNsaWRlRnJvbVRvcDpcbiAgICBwcm9wZXJ0eTogXCJ5XCJcbiAgICBmYWN0b3I6IFwiaGVpZ2h0XCJcbiAgICBmcm9tOiAtMVxuICAgIHRvOiAwXG5cbiAgc2xpZGVUb1RvcDpcbiAgICBwcm9wZXJ0eTogXCJ5XCJcbiAgICBmYWN0b3I6IFwiaGVpZ2h0XCJcbiAgICB0bzogLTFcblxuICBzbGlkZUZyb21Cb3R0b206XG4gICAgcHJvcGVydHk6IFwieVwiXG4gICAgZmFjdG9yOiBcImhlaWdodFwiXG4gICAgZnJvbTogMVxuICAgIHRvOiAwXG5cbiAgc2xpZGVUb0JvdHRvbTpcbiAgICBwcm9wZXJ0eTogXCJ5XCJcbiAgICBmYWN0b3I6IFwiaGVpZ2h0XCJcbiAgICB0bzogMVxuXG5cblxuXy5lYWNoIHNob3J0Y3V0cy5zbGlkZUFuaW1hdGlvbnMsIChvcHRzLCBuYW1lKSAtPlxuICBMYXllci5wcm90b3R5cGVbbmFtZV0gPSAodGltZSkgLT5cbiAgICBfcGhvbmUgPSBGcmFtZXIuRGV2aWNlPy5zY3JlZW4/LmZyYW1lXG5cbiAgICB1bmxlc3MgX3Bob25lXG4gICAgICBlcnIgPSBcIlBsZWFzZSBzZWxlY3QgYSBkZXZpY2UgcHJldmlldyBpbiBGcmFtZXIgU3R1ZGlvIHRvIHVzZSB0aGUgc2xpZGUgcHJlc2V0IGFuaW1hdGlvbnMuXCJcbiAgICAgIHByaW50IGVyclxuICAgICAgY29uc29sZS5sb2cgZXJyXG4gICAgICByZXR1cm5cblxuICAgIF9wcm9wZXJ0eSA9IG9wdHMucHJvcGVydHlcbiAgICBfZmFjdG9yID0gX3Bob25lW29wdHMuZmFjdG9yXVxuXG4gICAgaWYgb3B0cy5mcm9tP1xuICAgICAgIyBJbml0aWF0ZSB0aGUgc3RhcnQgcG9zaXRpb24gb2YgdGhlIGFuaW1hdGlvbiAoaS5lLiBvZmYgc2NyZWVuIG9uIHRoZSBsZWZ0IGNvcm5lcilcbiAgICAgIHRoaXNbX3Byb3BlcnR5XSA9IG9wdHMuZnJvbSAqIF9mYWN0b3JcblxuICAgICMgRGVmYXVsdCBhbmltYXRpb24gc3ludGF4IGxheWVyLmFuaW1hdGUoe19wcm9wZXJ0eTogMH0pIHdvdWxkIHRyeSB0byBhbmltYXRlICdfcHJvcGVydHknIGxpdGVyYWxseSwgaW4gb3JkZXIgZm9yIGl0IHRvIGJsb3cgdXAgdG8gd2hhdCdzIGluIGl0IChlZyB4KSwgd2UgdXNlIHRoaXMgc3ludGF4XG4gICAgX2FuaW1hdGlvbkNvbmZpZyA9IHt9XG4gICAgX2FuaW1hdGlvbkNvbmZpZ1tfcHJvcGVydHldID0gb3B0cy50byAqIF9mYWN0b3JcblxuICAgIGlmIHRpbWVcbiAgICAgIF90aW1lID0gdGltZVxuICAgICAgX2N1cnZlID0gXCJiZXppZXItY3VydmVcIlxuICAgIGVsc2VcbiAgICAgIF90aW1lID0gRnJhbWVyLkRlZmF1bHRzLlNsaWRlQW5pbWF0aW9uLnRpbWVcbiAgICAgIF9jdXJ2ZSA9IEZyYW1lci5EZWZhdWx0cy5TbGlkZUFuaW1hdGlvbi5jdXJ2ZVxuXG4gICAgdGhpcy5hbmltYXRlXG4gICAgICBwcm9wZXJ0aWVzOiBfYW5pbWF0aW9uQ29uZmlnXG4gICAgICB0aW1lOiBfdGltZVxuICAgICAgY3VydmU6IF9jdXJ2ZVxuXG5cblxuIyMjXG4gIEVBU1kgRkFERSBJTiAvIEZBREUgT1VUXG5cbiAgLnNob3coKSBhbmQgLmhpZGUoKSBhcmUgc2hvcnRjdXRzIHRvIGFmZmVjdCBvcGFjaXR5IGFuZCBwb2ludGVyIGV2ZW50cy4gVGhpcyBpcyBlc3NlbnRpYWxseSB0aGUgc2FtZSBhcyBoaWRpbmcgd2l0aCBgdmlzaWJsZSA9IGZhbHNlYCBidXQgY2FuIGJlIGFuaW1hdGVkLlxuXG4gIC5mYWRlSW4oKSBhbmQgLmZhZGVPdXQoKSBhcmUgc2hvcnRjdXRzIHRvIGZhZGUgaW4gYSBoaWRkZW4gbGF5ZXIsIG9yIGZhZGUgb3V0IGEgdmlzaWJsZSBsYXllci5cblxuICBUaGVzZSBzaG9ydGN1dHMgd29yayBvbiBpbmRpdmlkdWFsIGxheWVyIG9iamVjdHMgYXMgd2VsbCBhcyBhbiBhcnJheSBvZiBsYXllcnMuXG5cbiAgRXhhbXBsZTpcbiAgKiBgTXlMYXllci5mYWRlSW4oKWAgd2lsbCBmYWRlIGluIE15TGF5ZXIgdXNpbmcgZGVmYXVsdCB0aW1pbmcuXG4gICogYFtNeUxheWVyLCBPdGhlckxheWVyXS5mYWRlT3V0KDQpYCB3aWxsIGZhZGUgb3V0IGJvdGggTXlMYXllciBhbmQgT3RoZXJMYXllciBvdmVyIDQgc2Vjb25kcy5cblxuICBUbyBjdXN0b21pemUgdGhlIGZhZGUgYW5pbWF0aW9uLCBjaGFuZ2UgdGhlIHZhcmlhYmxlcyB0aW1lIGFuZCBjdXJ2ZSBpbnNpZGUgYEZyYW1lci5EZWZhdWx0cy5GYWRlQW5pbWF0aW9uYC5cbiMjI1xuTGF5ZXI6OnNob3cgPSAtPlxuICBAb3BhY2l0eSA9IDFcbiAgQHN0eWxlLnBvaW50ZXJFdmVudHMgPSAnYXV0bydcbiAgQFxuXG5MYXllcjo6aGlkZSA9IC0+XG4gIEBvcGFjaXR5ID0gMFxuICBAc3R5bGUucG9pbnRlckV2ZW50cyA9ICdub25lJ1xuICBAXG5cbkxheWVyOjpmYWRlSW4gPSAodGltZSA9IEZyYW1lci5EZWZhdWx0cy5GYWRlQW5pbWF0aW9uLnRpbWUpIC0+XG4gIHJldHVybiBpZiBAb3BhY2l0eSA9PSAxXG5cbiAgdW5sZXNzIEB2aXNpYmxlXG4gICAgQG9wYWNpdHkgPSAwXG4gICAgQHZpc2libGUgPSB0cnVlXG5cbiAgQGFuaW1hdGVUbyBvcGFjaXR5OiAxLCB0aW1lLCBGcmFtZXIuRGVmYXVsdHMuRmFkZUFuaW1hdGlvbi5jdXJ2ZVxuXG5MYXllcjo6ZmFkZU91dCA9ICh0aW1lID0gRnJhbWVyLkRlZmF1bHRzLkZhZGVBbmltYXRpb24udGltZSkgLT5cbiAgcmV0dXJuIGlmIEBvcGFjaXR5ID09IDBcblxuICB0aGF0ID0gQFxuICBAYW5pbWF0ZVRvIG9wYWNpdHk6IDAsIHRpbWUsIEZyYW1lci5EZWZhdWx0cy5GYWRlQW5pbWF0aW9uLmN1cnZlLCAtPiB0aGF0LnN0eWxlLnBvaW50ZXJFdmVudHMgPSAnbm9uZSdcblxuIyBhbGwgb2YgdGhlIGVhc3kgaW4vb3V0IGhlbHBlcnMgd29yayBvbiBhbiBhcnJheSBvZiB2aWV3cyBhcyB3ZWxsIGFzIGluZGl2aWR1YWwgdmlld3Ncbl8uZWFjaCBbJ3Nob3cnLCAnaGlkZScsICdmYWRlSW4nLCAnZmFkZU91dCddLCAoZm5TdHJpbmcpLT4gIFxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkgQXJyYXkucHJvdG90eXBlLCBmblN0cmluZywgXG4gICAgZW51bWVyYWJsZTogZmFsc2VcbiAgICB2YWx1ZTogKHRpbWUpIC0+XG4gICAgICBfLmVhY2ggQCwgKGxheWVyKSAtPlxuICAgICAgICBMYXllci5wcm90b3R5cGVbZm5TdHJpbmddLmNhbGwobGF5ZXIsIHRpbWUpIGlmIGxheWVyIGluc3RhbmNlb2YgTGF5ZXJcbiAgICAgIEBcblxuXG4jIyNcbiAgRUFTWSBIT1ZFUiBBTkQgVE9VQ0gvQ0xJQ0sgU1RBVEVTIEZPUiBMQVlFUlNcblxuICBCeSBuYW1pbmcgeW91ciBsYXllciBoaWVyYXJjaHkgaW4gdGhlIGZvbGxvd2luZyB3YXksIHlvdSBjYW4gYXV0b21hdGljYWxseSBoYXZlIHlvdXIgbGF5ZXJzIHJlYWN0IHRvIGhvdmVycywgY2xpY2tzIG9yIHRhcHMuXG5cbiAgQnV0dG9uX3RvdWNoYWJsZVxuICAtIEJ1dHRvbl9kZWZhdWx0IChkZWZhdWx0IHN0YXRlKVxuICAtIEJ1dHRvbl9kb3duICh0b3VjaC9jbGljayBzdGF0ZSlcbiAgLSBCdXR0b25faG92ZXIgKGhvdmVyKVxuIyMjXG5cbnNob3J0Y3V0cy5pbml0aWFsaXplVG91Y2hTdGF0ZXMgPSAobGF5ZXIpIC0+XG4gIF9kZWZhdWx0ID0gbGF5ZXIuZ2V0Q2hpbGQoJ2RlZmF1bHQnKVxuXG4gIGlmIGxheWVyLm5hbWUudG9Mb3dlckNhc2UoKS5pbmRleE9mKCd0b3VjaGFibGUnKSBhbmQgX2RlZmF1bHRcblxuICAgIHVubGVzcyBGcmFtZXIuVXRpbHMuaXNNb2JpbGUoKVxuICAgICAgX2hvdmVyID0gbGF5ZXIuZ2V0Q2hpbGQoJ2hvdmVyJylcbiAgICBfZG93biA9IGxheWVyLmdldENoaWxkKCdkb3duJylcblxuICAgICMgVGhlc2UgbGF5ZXJzIHNob3VsZCBiZSBoaWRkZW4gYnkgZGVmYXVsdFxuICAgIF9ob3Zlcj8uaGlkZSgpXG4gICAgX2Rvd24/LmhpZGUoKVxuXG4gICAgIyBDcmVhdGUgZmFrZSBoaXQgdGFyZ2V0IChzbyB3ZSBkb24ndCByZS1maXJlIGV2ZW50cylcbiAgICBpZiBfaG92ZXIgb3IgX2Rvd25cbiAgICAgIGhpdFRhcmdldCA9IG5ldyBMYXllclxuICAgICAgICBiYWNrZ3JvdW5kOiAndHJhbnNwYXJlbnQnXG4gICAgICAgIGZyYW1lOiBfZGVmYXVsdC5mcmFtZVxuXG4gICAgICBoaXRUYXJnZXQuc3VwZXJMYXllciA9IGxheWVyXG4gICAgICBoaXRUYXJnZXQuYnJpbmdUb0Zyb250KClcblxuICAgICMgVGhlcmUgaXMgYSBob3ZlciBzdGF0ZSwgc28gZGVmaW5lIGhvdmVyIGV2ZW50cyAobm90IGZvciBtb2JpbGUpXG4gICAgaWYgX2hvdmVyXG4gICAgICBsYXllci5ob3ZlciAtPlxuICAgICAgICBfZGVmYXVsdC5oaWRlKClcbiAgICAgICAgX2hvdmVyLnNob3coKVxuICAgICAgLCAtPlxuICAgICAgICBfZGVmYXVsdC5zaG93KClcbiAgICAgICAgX2hvdmVyLmhpZGUoKVxuXG4gICAgIyBUaGVyZSBpcyBhIGRvd24gc3RhdGUsIHNvIGRlZmluZSBkb3duIGV2ZW50c1xuICAgIGlmIF9kb3duXG4gICAgICBsYXllci5vbiBFdmVudHMuVG91Y2hTdGFydCwgLT5cbiAgICAgICAgX2RlZmF1bHQuaGlkZSgpXG4gICAgICAgIF9ob3Zlcj8uaGlkZSgpICMgdG91Y2ggZG93biBzdGF0ZSBvdmVycmlkZXMgaG92ZXIgc3RhdGVcbiAgICAgICAgX2Rvd24uc2hvdygpXG5cbiAgICAgIGxheWVyLm9uIEV2ZW50cy5Ub3VjaEVuZCwgLT5cbiAgICAgICAgX2Rvd24uaGlkZSgpXG5cbiAgICAgICAgaWYgX2hvdmVyXG4gICAgICAgICAgIyBJZiB0aGVyZSB3YXMgYSBob3ZlciBzdGF0ZSwgZ28gYmFjayB0byB0aGUgaG92ZXIgc3RhdGVcbiAgICAgICAgICBfaG92ZXIuc2hvdygpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBfZGVmYXVsdC5zaG93KClcblxuXG5fLmV4dGVuZChleHBvcnRzLCBzaG9ydGN1dHMpXG5cbiJdfQ==
