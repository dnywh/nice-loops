require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"audio":[function(require,module,exports){
var scaledScreenFrame,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

document.body.style.cursor = "auto";

exports.AudioPlayer = (function(superClass) {
  extend(AudioPlayer, superClass);

  function AudioPlayer(options) {
    var audioControls;
    if (options == null) {
      options = {};
    }
    this.getTimeLeft = bind(this.getTimeLeft, this);
    if (options.backgroundColor == null) {
      options.backgroundColor = "transparent";
    }
    AudioPlayer.__super__.constructor.call(this, options);
    this.controls = new Layer({
      backgroundColor: "transparent",
      width: 80,
      height: 80,
      superLayer: this
    });
    this.controls.showPlay = function() {
      return this.image = "images/play.png";
    };
    this.controls.showPause = function() {
      return this.image = "images/pause.png";
    };
    this.controls.showPlay();
    this.controls.center();
    this.player = document.createElement("audio");
    this.player.setAttribute("webkit-playsinline", "true");
    this.player.setAttribute("preload", "auto");
    this.player.style.width = "100%";
    this.player.style.height = "100%";
    this.player.on = this.player.addEventListener;
    this.player.off = this.player.removeEventListener;
    this.timeStyle = {
      "font-size": "20px",
      "color": "#000"
    };
    this.on(Events.Click, function() {
      var currentTime, duration;
      currentTime = Math.round(this.player.currentTime);
      duration = Math.round(this.player.duration);
      if (this.player.paused) {
        this.player.play();
        this.controls.showPause();
        if (currentTime === duration) {
          this.player.currentTime = 0;
          return this.player.play();
        }
      } else {
        this.player.pause();
        return this.controls.showPlay();
      }
    });
    audioControls = this.controls;
    this.player.onended = function() {
      return audioControls.showPlay();
    };
    this.player.baseProgressOn = function(layer) {
      return Utils.modulate(this.currentTime, [0, this.duration], [0, layer.width], true);
    };
    this.player.baseVolumeOn = function(layer) {
      return Utils.modulate(this.volume, [0, 1], [0, layer.width], true);
    };
    this.player.formatTime = function() {
      var min, sec;
      sec = Math.floor(this.currentTime);
      min = Math.floor(sec / 60);
      sec = Math.floor(sec % 60);
      sec = sec >= 10 ? sec : '0' + sec;
      return min + ":" + sec;
    };
    this.player.formatTimeLeft = function() {
      var min, sec;
      sec = Math.floor(this.duration) - Math.floor(this.currentTime);
      min = Math.floor(sec / 60);
      sec = Math.floor(sec % 60);
      sec = sec >= 10 ? sec : '0' + sec;
      return min + ":" + sec;
    };
    this.audio = options.audio;
    this._element.appendChild(this.player);
  }

  AudioPlayer.define("audio", {
    get: function() {
      return this.player.src;
    },
    set: function(audio) {
      this.player.src = audio;
      if (this.player.canPlayType("audio/mp3") === "") {
        throw Error("No supported audio file included.");
      }
    }
  });

  AudioPlayer.define("showProgress", {
    get: function() {
      return this._showProgress;
    },
    set: function(showProgress) {
      return this.setProgress(showProgress, false);
    }
  });

  AudioPlayer.define("showVolume", {
    get: function() {
      return this._showVolume;
    },
    set: function(showVolume) {
      return this.setVolume(showVolume, false);
    }
  });

  AudioPlayer.define("showTime", {
    get: function() {
      return this._showTime;
    },
    set: function(showTime) {
      return this.getTime(showTime, false);
    }
  });

  AudioPlayer.define("showTimeLeft", {
    get: function() {
      return this._showTimeLeft;
    },
    set: function(showTimeLeft) {
      return this.getTimeLeft(showTimeLeft, false);
    }
  });

  AudioPlayer.prototype._checkBoolean = function(property) {
    var ref, ref1;
    if (_.isString(property)) {
      if ((ref = property.toLowerCase()) === "1" || ref === "true") {
        property = true;
      } else if ((ref1 = property.toLowerCase()) === "0" || ref1 === "false") {
        property = false;
      } else {
        return;
      }
    }
    if (!_.isBool(property)) {

    }
  };

  AudioPlayer.prototype.getTime = function(showTime) {
    this._checkBoolean(showTime);
    this._showTime = showTime;
    if (showTime === true) {
      this.time = new Layer({
        backgroundColor: "transparent"
      });
      this.time.style = this.timeStyle;
      return this.time.html = "0:00";
    }
  };

  AudioPlayer.prototype.getTimeLeft = function(showTimeLeft) {
    this._checkBoolean(showTimeLeft);
    this._showTimeLeft = showTimeLeft;
    if (showTimeLeft === true) {
      this.timeLeft = new Layer({
        backgroundColor: "transparent"
      });
      this.timeLeft.style = this.timeStyle;
      this.timeLeft.html = "-0:00";
      return this.player.on("loadedmetadata", (function(_this) {
        return function() {
          return _this.timeLeft.html = "-" + _this.player.formatTimeLeft();
        };
      })(this));
    }
  };

  AudioPlayer.prototype.setProgress = function(showProgress) {
    var mousedown, offsetX, progressFill, progressWidth, wasPlaying;
    this._checkBoolean(showProgress);
    this._showProgress = showProgress;
    if (this._showProgress === true) {
      this.progressBar = new Layer({
        width: 200,
        height: 6,
        backgroundColor: "#eee",
        clip: true
      });
      this.progressFill = new Layer({
        width: 0,
        height: this.progressBar.height,
        backgroundColor: "#222",
        superLayer: this.progressBar
      });
      this.progressBar.on("change:height", function() {
        return progressFill.height = this.height;
      });
      this.progressFill.force2d = true;
      mousedown = wasPlaying = false;
      offsetX = null;
      progressFill = this.progressFill;
      progressWidth = this.progressBar.width;
      this.progressBar.on(Events.TouchStart, (function(_this) {
        return function(event) {
          mousedown = true;
          if (!_this.player.paused) {
            return wasPlaying = true;
          }
        };
      })(this));
      Framer.Device.screen.on(Events.TouchMove, (function(_this) {
        return function(event) {
          var eventX, newFrame, progressX;
          newFrame = scaledScreenFrame(Framer.Device.screen);
          eventX = Utils.round(Events.touchEvent(event).clientX - newFrame.x, 1);
          progressWidth = _this.progressBar.width * _this.progressBar.screenScaleX();
          progressX = _this.progressBar.x * _this.progressBar.screenScaleX();
          offsetX = eventX - progressX;
          offsetX = Utils.modulate(offsetX, [0, progressWidth], [0, progressWidth], true);
          if (mousedown === true) {
            _this.player.pause();
            return _this.player.currentTime = _this.player.duration * (offsetX / progressWidth);
          }
        };
      })(this));
      Framer.Device.screen.on(Events.TouchEnd, (function(_this) {
        return function(event) {
          var currentTime, duration;
          if (mousedown === true) {
            _this.player.currentTime = _this.player.duration * (offsetX / progressWidth);
            currentTime = Math.round(_this.player.currentTime);
            duration = Math.round(_this.player.duration);
            if (wasPlaying && currentTime !== duration) {
              _this.player.play();
              _this.controls.showPause();
            }
            if (currentTime === duration) {
              _this.player.pause();
              _this.controls.showPlay();
            }
          }
          return mousedown = false;
        };
      })(this));
      return this.player.ontimeupdate = (function(_this) {
        return function() {
          _this.progressFill.width = _this.player.baseProgressOn(_this.progressBar);
          _this.time.html = _this.player.formatTime();
          return _this.timeLeft.html = "-" + _this.player.formatTimeLeft();
        };
      })(this);
    }
  };

  AudioPlayer.prototype.setVolume = function(showVolume) {
    var getVolume, mousedown;
    this._checkBoolean(showVolume);
    this.player.volume = 0.75;
    this.volumeBar = new Layer({
      width: 200,
      height: 6,
      backgroundColor: "#eee",
      clip: true
    });
    this.volumeBar.y += 24;
    this.volumeFill = new Layer({
      width: this.volumeBar.width * 0.75,
      height: this.volumeBar.height,
      backgroundColor: "#333",
      superLayer: this.volumeBar
    });
    this.volumeFill.force2d = true;
    this.volumeBar.on("change:height", (function(_this) {
      return function() {
        return _this.volumeFill.height = _this.volumeBar.height;
      };
    })(this));
    this.volumeBar.on("change:width", (function(_this) {
      return function() {
        return _this.volumeFill.width = _this.volumeBar.width * 0.75;
      };
    })(this));
    mousedown = false;
    getVolume = null;
    this.volumeBar.on(Events.TouchStart, function(event) {
      return mousedown = true;
    });
    Framer.Device.screen.on(Events.TouchMove, (function(_this) {
      return function(event) {
        var eventX, newFrame, volumeWidth, volumeX;
        newFrame = scaledScreenFrame(Framer.Device.screen);
        eventX = Utils.round(Events.touchEvent(event).clientX - newFrame.x, 1);
        volumeWidth = _this.volumeBar.width * _this.volumeBar.screenScaleX();
        volumeX = _this.volumeBar.x * _this.volumeBar.screenScaleX();
        getVolume = eventX - volumeX;
        getVolume = Utils.modulate(getVolume, [0, volumeWidth], [0, 1], true);
        if (mousedown === true) {
          return _this.player.volume = getVolume;
        }
      };
    })(this));
    Framer.Device.screen.on(Events.TouchEnd, (function(_this) {
      return function(event) {
        if (mousedown === true) {
          _this.player.volume = getVolume;
        }
        return mousedown = false;
      };
    })(this));
    return this.player.onvolumechange = (function(_this) {
      return function() {
        return _this.volumeFill.width = _this.player.baseVolumeOn(_this.volumeBar);
      };
    })(this);
  };

  return AudioPlayer;

})(Layer);

scaledScreenFrame = function(layer) {
  var frame;
  frame = layer.screenFrame;
  frame.width *= layer.screenScaleX();
  frame.height *= layer.screenScaleY();
  frame.x += (layer.width - frame.width) * layer.originX;
  frame.y += (layer.height - frame.height) * layer.originX;
  return frame;
};



},{}],"myModule":[function(require,module,exports){
exports.myVar = "myVariable";

exports.myFunction = function() {
  return print("myFunction is running");
};

exports.myArray = [1, 2, 3];



},{}],"shortcuts":[function(require,module,exports){

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvZGFuaWVsL0dpdGh1Yi9uaWNlLWxvb3BzL3B1c2guZnJhbWVyL21vZHVsZXMvYXVkaW8uY29mZmVlIiwiL1VzZXJzL2RhbmllbC9HaXRodWIvbmljZS1sb29wcy9wdXNoLmZyYW1lci9tb2R1bGVzL215TW9kdWxlLmNvZmZlZSIsIi9Vc2Vycy9kYW5pZWwvR2l0aHViL25pY2UtbG9vcHMvcHVzaC5mcmFtZXIvbW9kdWxlcy9zaG9ydGN1dHMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQ0EsSUFBQSxpQkFBQTtFQUFBOzs2QkFBQTs7QUFBQSxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFwQixHQUE2QixNQUE3QixDQUFBOztBQUFBLE9BR2EsQ0FBQztBQUViLGlDQUFBLENBQUE7O0FBQWEsRUFBQSxxQkFBQyxPQUFELEdBQUE7QUFDWixRQUFBLGFBQUE7O01BRGEsVUFBUTtLQUNyQjtBQUFBLG1EQUFBLENBQUE7O01BQUEsT0FBTyxDQUFDLGtCQUFtQjtLQUEzQjtBQUFBLElBQ0EsNkNBQU0sT0FBTixDQURBLENBQUE7QUFBQSxJQUlBLElBQUMsQ0FBQSxRQUFELEdBQWdCLElBQUEsS0FBQSxDQUNmO0FBQUEsTUFBQSxlQUFBLEVBQWlCLGFBQWpCO0FBQUEsTUFDQSxLQUFBLEVBQU0sRUFETjtBQUFBLE1BQ1UsTUFBQSxFQUFPLEVBRGpCO0FBQUEsTUFDcUIsVUFBQSxFQUFZLElBRGpDO0tBRGUsQ0FKaEIsQ0FBQTtBQUFBLElBUUEsSUFBQyxDQUFBLFFBQVEsQ0FBQyxRQUFWLEdBQXFCLFNBQUEsR0FBQTthQUFHLElBQUMsQ0FBQSxLQUFELEdBQVMsa0JBQVo7SUFBQSxDQVJyQixDQUFBO0FBQUEsSUFTQSxJQUFDLENBQUEsUUFBUSxDQUFDLFNBQVYsR0FBc0IsU0FBQSxHQUFBO2FBQUcs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QUUsSUFBUixDQUFBO1NBREE7ZUFFQSxLQUFLLENBQUMsSUFBTixDQUFBLEVBSDBCO01BQUEsQ0FBNUIsQ0FBQSxDQUFBO2FBS0EsS0FBSyxDQUFDLEVBQU4sQ0FBUyxNQUFNLENBQUMsUUFBaEIsRUFBMEIsU0FBQSxHQUFBO0FBQ3hCLFFBQUEsS0FBSyxDQUFDLElBQU4sQ0FBQSxDQUFBLENBQUE7QUFFQSxRQUFBLElBQUcsTUFBSDtpQkFFRSxNQUFNLENBQUMsSUFBUCxDQUFBLEVBRkY7U0FBQSxNQUFBO2lCQUlFLFFBQVEsQ0FBQyxJQUFULENBQUEsRUFKRjtTQUh3QjtNQUFBLENBQTFCLEVBTkY7S0E3QkY7R0FIZ0M7QUFBQSxDQXpibEMsQ0FBQTs7QUFBQSxDQXllQyxDQUFDLE1BQUYsQ0FBUyxPQUFULEVBQWtCLFNBQWxCLENBemVBLENBQUEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiIyBTZXQgZGVmYXVsdCBjdXJzb3JcbmRvY3VtZW50LmJvZHkuc3R5bGUuY3Vyc29yID0gXCJhdXRvXCJcblxuIyBBdWRpb1BsYXllciBDbGFzc1xuY2xhc3MgZXhwb3J0cy5BdWRpb1BsYXllciBleHRlbmRzIExheWVyXG5cdFxuXHRjb25zdHJ1Y3RvcjogKG9wdGlvbnM9e30pIC0+XG5cdFx0b3B0aW9ucy5iYWNrZ3JvdW5kQ29sb3IgPz0gXCJ0cmFuc3BhcmVudFwiXHRcdFx0XG5cdFx0c3VwZXIgb3B0aW9uc1xuXHRcdFx0XHRcblx0XHQjIERlZmluZSBiYXNpYyBjb250cm9sc1xuXHRcdEBjb250cm9scyA9IG5ldyBMYXllciBcblx0XHRcdGJhY2tncm91bmRDb2xvcjogXCJ0cmFuc3BhcmVudFwiXG5cdFx0XHR3aWR0aDo4MCwgaGVpZ2h0OjgwLCBzdXBlckxheWVyOiBAXG5cdFx0XHRcblx0XHRAY29udHJvbHMuc2hvd1BsYXkgPSAtPiBAaW1hZ2UgPSBcImltYWdlcy9wbGF5LnBuZ1wiXG5cdFx0QGNvbnRyb2xzLnNob3dQYXVzZSA9IC0+IEBpbWFnZSA9IFwiaW1hZ2VzL3BhdXNlLnBuZ1wiXG5cdFx0QGNvbnRyb2xzLnNob3dQbGF5KClcblx0XHRAY29udHJvbHMuY2VudGVyKClcblx0XHRcdFx0XG5cdFx0IyBEZWZpbmUgcGxheWVyXG5cdFx0QHBsYXllciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhdWRpb1wiKVxuXHRcdEBwbGF5ZXIuc2V0QXR0cmlidXRlKFwid2Via2l0LXBsYXlzaW5saW5lXCIsIFwidHJ1ZVwiKVxuXHRcdEBwbGF5ZXIuc2V0QXR0cmlidXRlKFwicHJlbG9hZFwiLCBcImF1dG9cIilcblx0XHRAcGxheWVyLnN0eWxlLndpZHRoID0gXCIxMDAlXCJcblx0XHRAcGxheWVyLnN0eWxlLmhlaWdodCA9IFwiMTAwJVwiXG5cblx0XHRAcGxheWVyLm9uID0gQHBsYXllci5hZGRFdmVudExpc3RlbmVyXG5cdFx0QHBsYXllci5vZmYgPSBAcGxheWVyLnJlbW92ZUV2ZW50TGlzdGVuZXJcblx0XHRcblx0XHRAdGltZVN0eWxlID0geyBcImZvbnQtc2l6ZVwiOiBcIjIwcHhcIiwgXCJjb2xvclwiOiBcIiMwMDBcIiB9XG5cdFx0XG5cdFx0IyBPbiBjbGlja1xuXHRcdEBvbiBFdmVudHMuQ2xpY2ssIC0+XG5cdFx0XHRjdXJyZW50VGltZSA9IE1hdGgucm91bmQoQHBsYXllci5jdXJyZW50VGltZSlcblx0XHRcdGR1cmF0aW9uID0gTWF0aC5yb3VuZChAcGxheWVyLmR1cmF0aW9uKVxuXHRcdFx0XG5cdFx0XHRpZiBAcGxheWVyLnBhdXNlZCBcblx0XHRcdFx0QHBsYXllci5wbGF5KClcblx0XHRcdFx0QGNvbnRyb2xzLnNob3dQYXVzZSgpXG5cdFx0XHRcdFxuXHRcdFx0XHRpZiBjdXJyZW50VGltZSBpcyBkdXJhdGlvblxuXHRcdFx0XHRcdEBwbGF5ZXIuY3VycmVudFRpbWUgPSAwXG5cdFx0XHRcdFx0QHBsYXllci5wbGF5KClcblx0XHRcdFx0XG5cdFx0XHRlbHNlIFxuXHRcdFx0XHRAcGxheWVyLnBhdXNlKClcblx0XHRcdFx0QGNvbnRyb2xzLnNob3dQbGF5KClcblx0XHRcdFx0XG5cdFx0IyBPbiBlbmQsIHN3aXRjaCB0byBwbGF5IGJ1dHRvblxuXHRcdGF1ZGlvQ29udHJvbHMgPSBAY29udHJvbHNcdFxuXHRcdEBwbGF5ZXIub25lbmRlZCA9IC0+IFxuXHRcdFx0YXVkaW9Db250cm9scy5zaG93UGxheSgpXG5cdFx0XHRcblx0XHQjIFV0aWxzIFxuXHRcdEBwbGF5ZXIuYmFzZVByb2dyZXNzT24gPSAobGF5ZXIpIC0+XG5cdFx0XHRVdGlscy5tb2R1bGF0ZShAY3VycmVudFRpbWUsIFswLCBAZHVyYXRpb25dLFswLGxheWVyLndpZHRoXSwgdHJ1ZSlcblxuXHRcdEBwbGF5ZXIuYmFzZVZvbHVtZU9uID0gKGxheWVyKSAtPlxuXHRcdFx0VXRpbHMubW9kdWxhdGUoQHZvbHVtZSwgWzAsIDFdLFswLGxheWVyLndpZHRoXSwgdHJ1ZSlcblx0XHRcdFx0XHRcblx0XHRAcGxheWVyLmZvcm1hdFRpbWUgPSAtPlxuXHRcdFx0c2VjID0gTWF0aC5mbG9vcihAY3VycmVudFRpbWUpXG5cdFx0XHRtaW4gPSBNYXRoLmZsb29yKHNlYyAvIDYwKVxuXHRcdFx0c2VjID0gTWF0aC5mbG9vcihzZWMgJSA2MClcblx0XHRcdHNlYyA9IGlmIHNlYyA+PSAxMCB0aGVuIHNlYyBlbHNlICcwJyArIHNlY1xuXHRcdFx0cmV0dXJuIFwiI3ttaW59OiN7c2VjfVwiXG5cdFx0XHRcblx0XHRAcGxheWVyLmZvcm1hdFRpbWVMZWZ0ID0gLT5cblx0XHRcdHNlYyA9IE1hdGguZmxvb3IoQGR1cmF0aW9uKSAtIE1hdGguZmxvb3IoQGN1cnJlbnRUaW1lKVxuXHRcdFx0bWluID0gTWF0aC5mbG9vcihzZWMgLyA2MClcblx0XHRcdHNlYyA9IE1hdGguZmxvb3Ioc2VjICUgNjApXG5cdFx0XHRzZWMgPSBpZiBzZWMgPj0gMTAgdGhlbiBzZWMgZWxzZSAnMCcgKyBzZWNcblx0XHRcdHJldHVybiBcIiN7bWlufToje3NlY31cIlxuXHRcdFx0XHRcdFxuXHRcdEBhdWRpbyA9IG9wdGlvbnMuYXVkaW9cblx0XHRAX2VsZW1lbnQuYXBwZW5kQ2hpbGQoQHBsYXllcilcblx0XG5cdEBkZWZpbmUgXCJhdWRpb1wiLFxuXHRcdGdldDogLT4gQHBsYXllci5zcmNcblx0XHRzZXQ6IChhdWRpbykgLT4gXG5cdFx0XHRAcGxheWVyLnNyYyA9IGF1ZGlvXHRcblx0XHRcdGlmIEBwbGF5ZXIuY2FuUGxheVR5cGUoXCJhdWRpby9tcDNcIikgPT0gXCJcIlxuXHRcdFx0XHR0aHJvdyBFcnJvciBcIk5vIHN1cHBvcnRlZCBhdWRpbyBmaWxlIGluY2x1ZGVkLlwiXG5cdFxuXHRAZGVmaW5lIFwic2hvd1Byb2dyZXNzXCIsXG5cdFx0Z2V0OiAtPiBAX3Nob3dQcm9ncmVzc1xuXHRcdHNldDogKHNob3dQcm9ncmVzcykgLT4gQHNldFByb2dyZXNzKHNob3dQcm9ncmVzcywgZmFsc2UpXG5cdFxuXHRAZGVmaW5lIFwic2hvd1ZvbHVtZVwiLFxuXHRcdGdldDogLT4gQF9zaG93Vm9sdW1lXG5cdFx0c2V0OiAoc2hvd1ZvbHVtZSkgLT4gQHNldFZvbHVtZShzaG93Vm9sdW1lLCBmYWxzZSlcblx0XG5cdEBkZWZpbmUgXCJzaG93VGltZVwiLFxuXHRcdGdldDogLT4gQF9zaG93VGltZVxuXHRcdHNldDogKHNob3dUaW1lKSAtPiBAZ2V0VGltZShzaG93VGltZSwgZmFsc2UpXG5cdFxuXHRAZGVmaW5lIFwic2hvd1RpbWVMZWZ0XCIsXG5cdFx0Z2V0OiAtPiBAX3Nob3dUaW1lTGVmdFxuXHRcdHNldDogKHNob3dUaW1lTGVmdCkgLT4gQGdldFRpbWVMZWZ0KHNob3dUaW1lTGVmdCwgZmFsc2UpXG5cdFx0XG5cdCMgQ2hlY2tzIGEgcHJvcGVydHksIHJldHVybnMgXCJ0cnVlXCIgb3IgXCJmYWxzZVwiXG5cdF9jaGVja0Jvb2xlYW46IChwcm9wZXJ0eSkgLT5cblx0XHRpZiBfLmlzU3RyaW5nKHByb3BlcnR5KVxuXHRcdFx0aWYgcHJvcGVydHkudG9Mb3dlckNhc2UoKSBpbiBbXCIxXCIsIFwidHJ1ZVwiXVxuXHRcdFx0XHRwcm9wZXJ0eSA9IHRydWVcblx0XHRcdGVsc2UgaWYgcHJvcGVydHkudG9Mb3dlckNhc2UoKSBpbiBbXCIwXCIsIFwiZmFsc2VcIl1cblx0XHRcdFx0cHJvcGVydHkgPSBmYWxzZVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRyZXR1cm5cblx0XHRpZiBub3QgXy5pc0Jvb2wocHJvcGVydHkpIHRoZW4gcmV0dXJuXG5cdFx0XHRcblx0Z2V0VGltZTogKHNob3dUaW1lKSAtPlxuXHRcdEBfY2hlY2tCb29sZWFuKHNob3dUaW1lKVxuXHRcdEBfc2hvd1RpbWUgPSBzaG93VGltZVxuXHRcblx0XHRpZiBzaG93VGltZSBpcyB0cnVlXG5cdFx0XHRAdGltZSA9IG5ldyBMYXllciBiYWNrZ3JvdW5kQ29sb3I6IFwidHJhbnNwYXJlbnRcIlxuXHRcdFx0QHRpbWUuc3R5bGUgPSBAdGltZVN0eWxlXG5cdFx0XHRAdGltZS5odG1sID0gXCIwOjAwXCJcblxuXHRnZXRUaW1lTGVmdDogKHNob3dUaW1lTGVmdCkgPT5cblx0XHRAX2NoZWNrQm9vbGVhbihzaG93VGltZUxlZnQpXG5cdFx0QF9zaG93VGltZUxlZnQgPSBzaG93VGltZUxlZnRcblx0XHRcblx0XHRpZiBzaG93VGltZUxlZnQgaXMgdHJ1ZVxuXHRcdFx0QHRpbWVMZWZ0ID0gbmV3IExheWVyIGJhY2tncm91bmRDb2xvcjogXCJ0cmFuc3BhcmVudFwiXG5cdFx0XHRAdGltZUxlZnQuc3R5bGUgPSBAdGltZVN0eWxlXG5cdFx0XHRcblx0XHRcdCMgU2V0IHRpbWVMZWZ0XG5cdFx0XHRAdGltZUxlZnQuaHRtbCA9IFwiLTA6MDBcIlx0XHRcdFxuXHRcdFx0QHBsYXllci5vbiBcImxvYWRlZG1ldGFkYXRhXCIsID0+IFxuXHRcdFx0XHRAdGltZUxlZnQuaHRtbCA9IFwiLVwiICsgQHBsYXllci5mb3JtYXRUaW1lTGVmdCgpXG5cdFx0XG5cdHNldFByb2dyZXNzOiAoc2hvd1Byb2dyZXNzKSAtPlxuXHRcdEBfY2hlY2tCb29sZWFuKHNob3dQcm9ncmVzcylcblx0XHRcblx0XHQjIFNldCBhcmd1bWVudCAoc2hvd1Byb2dyZXNzIGlzIGVpdGhlciB0cnVlIG9yIGZhbHNlKVxuXHRcdEBfc2hvd1Byb2dyZXNzID0gc2hvd1Byb2dyZXNzXG5cdFx0XG5cdFx0aWYgQF9zaG93UHJvZ3Jlc3MgaXMgdHJ1ZVxuXHRcdFx0IyBDcmVhdGUgUHJvZ3Jlc3MgQmFyICsgRGVmYXVsdHNcdFxuXHRcdFx0QHByb2dyZXNzQmFyID0gbmV3IExheWVyIFxuXHRcdFx0XHR3aWR0aDogMjAwLCBoZWlnaHQ6NiwgYmFja2dyb3VuZENvbG9yOiBcIiNlZWVcIlxuXHRcdFx0XHRjbGlwOnRydWVcblx0XHRcdFxuXHRcdFx0IyBQcm9ncmVzcyBsYXllciArIERlZmF1bHRzXG5cdFx0XHRAcHJvZ3Jlc3NGaWxsID0gbmV3IExheWVyIFxuXHRcdFx0XHR3aWR0aDogMCwgaGVpZ2h0OiBAcHJvZ3Jlc3NCYXIuaGVpZ2h0LCBiYWNrZ3JvdW5kQ29sb3I6IFwiIzIyMlwiXG5cdFx0XHRcdHN1cGVyTGF5ZXI6IEBwcm9ncmVzc0JhclxuXG5cdFx0XHRAcHJvZ3Jlc3NCYXIub24gXCJjaGFuZ2U6aGVpZ2h0XCIsIC0+IFxuXHRcdFx0XHRwcm9ncmVzc0ZpbGwuaGVpZ2h0ID0gQGhlaWdodFxuXHRcdFx0XHRcblx0XHRcdCMgVG8gYWxsb3cgY2xpcHBpbmcgd2l0aCBib3JkZXJSYWRpdXNcblx0XHRcdEBwcm9ncmVzc0ZpbGwuZm9yY2UyZCA9IHRydWUgXG5cdFx0XHRcblx0XHRcdCMgQWxsb3cgc2NydWJiaW5nIG9mIHRpbWVcblx0XHRcdG1vdXNlZG93biA9IHdhc1BsYXlpbmcgPSBmYWxzZVxuXHRcdFx0b2Zmc2V0WCA9IG51bGxcblx0XHRcdFxuXHRcdFx0IyBTdG9yZSB2YXJpYWJsZXNcblx0XHRcdHByb2dyZXNzRmlsbCA9IEBwcm9ncmVzc0ZpbGxcblx0XHRcdHByb2dyZXNzV2lkdGggPSBAcHJvZ3Jlc3NCYXIud2lkdGhcblx0XHRcdFxuXHRcdFx0QHByb2dyZXNzQmFyLm9uIEV2ZW50cy5Ub3VjaFN0YXJ0LCAoZXZlbnQpID0+XG5cdFx0XHRcdG1vdXNlZG93biA9IHRydWVcblx0XHRcdFx0aWYgbm90IEBwbGF5ZXIucGF1c2VkIHRoZW4gd2FzUGxheWluZyA9IHRydWVcblx0XHRcdFx0XHRcdFxuXHRcdFx0IyBUbyBhbGxvdyBzY3J1YmJpbmcgb3V0c2lkZSBvZiB0aGUgcHJvZ3Jlc3NCYXJcblx0XHRcdEZyYW1lci5EZXZpY2Uuc2NyZWVuLm9uIEV2ZW50cy5Ub3VjaE1vdmUsIChldmVudCkgPT5cblx0XHRcdFx0bmV3RnJhbWUgPSBzY2FsZWRTY3JlZW5GcmFtZShGcmFtZXIuRGV2aWNlLnNjcmVlbilcblx0XHRcdFx0ZXZlbnRYID0gVXRpbHMucm91bmQoRXZlbnRzLnRvdWNoRXZlbnQoZXZlbnQpLmNsaWVudFggLSBuZXdGcmFtZS54LCAxKVxuXHRcdFx0XHRwcm9ncmVzc1dpZHRoID0gQHByb2dyZXNzQmFyLndpZHRoICogQHByb2dyZXNzQmFyLnNjcmVlblNjYWxlWCgpXG5cdFx0XHRcdHByb2dyZXNzWCA9IEBwcm9ncmVzc0Jhci54ICogQHByb2dyZXNzQmFyLnNjcmVlblNjYWxlWCgpXG5cdFx0XHRcdG9mZnNldFggPSAoZXZlbnRYIC0gcHJvZ3Jlc3NYKVxuXHRcdFx0XHRcblx0XHRcdFx0b2Zmc2V0WCA9IFV0aWxzLm1vZHVsYXRlKG9mZnNldFgsIFswLCBwcm9ncmVzc1dpZHRoXSwgWzAsIHByb2dyZXNzV2lkdGhdLCB0cnVlKVxuXHRcdFx0XG5cdFx0XHRcdGlmIG1vdXNlZG93biBpcyB0cnVlIFxuXHRcdFx0XHRcdEBwbGF5ZXIucGF1c2UoKVxuXHRcdFx0XHRcdEBwbGF5ZXIuY3VycmVudFRpbWUgPSBAcGxheWVyLmR1cmF0aW9uICogKG9mZnNldFggLyBwcm9ncmVzc1dpZHRoKVxuXHRcdFx0XHRcdFxuXHRcdFx0RnJhbWVyLkRldmljZS5zY3JlZW4ub24gRXZlbnRzLlRvdWNoRW5kLCAoZXZlbnQpID0+IFxuXHRcdFx0XHRpZiBtb3VzZWRvd24gaXMgdHJ1ZVxuXHRcdFx0XHRcdEBwbGF5ZXIuY3VycmVudFRpbWUgPSBAcGxheWVyLmR1cmF0aW9uICogKG9mZnNldFggLyBwcm9ncmVzc1dpZHRoKVxuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdGN1cnJlbnRUaW1lID0gTWF0aC5yb3VuZChAcGxheWVyLmN1cnJlbnRUaW1lKVxuXHRcdFx0XHRcdGR1cmF0aW9uID0gTWF0aC5yb3VuZChAcGxheWVyLmR1cmF0aW9uKVxuXHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0aWYgd2FzUGxheWluZyBhbmQgY3VycmVudFRpbWUgaXNudCBkdXJhdGlvblxuXHRcdFx0XHRcdFx0QHBsYXllci5wbGF5KClcblx0XHRcdFx0XHRcdEBjb250cm9scy5zaG93UGF1c2UoKVxuXHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0aWYgY3VycmVudFRpbWUgaXMgZHVyYXRpb25cblx0XHRcdFx0XHRcdEBwbGF5ZXIucGF1c2UoKVxuXHRcdFx0XHRcdFx0QGNvbnRyb2xzLnNob3dQbGF5KClcblx0XHRcdFxuXHRcdFx0XHRtb3VzZWRvd24gPSBmYWxzZVxuXHRcdFx0XHRcdFxuXHRcdFx0IyBVcGRhdGUgUHJvZ3Jlc3Ncblx0XHRcdEBwbGF5ZXIub250aW1ldXBkYXRlID0gPT5cblx0XHRcdFx0QHByb2dyZXNzRmlsbC53aWR0aCA9IEBwbGF5ZXIuYmFzZVByb2dyZXNzT24oQHByb2dyZXNzQmFyKVxuXHRcdFx0XHRAdGltZS5odG1sID0gQHBsYXllci5mb3JtYXRUaW1lKClcblx0XHRcdFx0QHRpbWVMZWZ0Lmh0bWwgPSBcIi1cIiArIEBwbGF5ZXIuZm9ybWF0VGltZUxlZnQoKVxuXHRcblx0c2V0Vm9sdW1lOiAoc2hvd1ZvbHVtZSkgLT5cblx0XHRAX2NoZWNrQm9vbGVhbihzaG93Vm9sdW1lKVxuXHRcdFxuXHRcdCMgU2V0IGRlZmF1bHQgdG8gNzUlXG5cdFx0QHBsYXllci52b2x1bWUgPSAwLjc1XG5cdFx0XG5cdFx0QHZvbHVtZUJhciA9IG5ldyBMYXllciB3aWR0aDogMjAwLCBoZWlnaHQ6NiwgYmFja2dyb3VuZENvbG9yOiBcIiNlZWVcIiwgY2xpcDp0cnVlXG5cdFx0QHZvbHVtZUJhci55ICs9IDI0XG5cdFx0XG5cdFx0QHZvbHVtZUZpbGwgPSBuZXcgTGF5ZXIgd2lkdGg6IEB2b2x1bWVCYXIud2lkdGgqMC43NSwgaGVpZ2h0OkB2b2x1bWVCYXIuaGVpZ2h0LCBiYWNrZ3JvdW5kQ29sb3I6IFwiIzMzM1wiLCBzdXBlckxheWVyOiBAdm9sdW1lQmFyXG5cdFx0QHZvbHVtZUZpbGwuZm9yY2UyZCA9IHRydWUgXG5cdFx0XG5cdFx0QHZvbHVtZUJhci5vbiBcImNoYW5nZTpoZWlnaHRcIiwgPT4gQHZvbHVtZUZpbGwuaGVpZ2h0ID0gQHZvbHVtZUJhci5oZWlnaHRcblx0XHRAdm9sdW1lQmFyLm9uIFwiY2hhbmdlOndpZHRoXCIsID0+IEB2b2x1bWVGaWxsLndpZHRoID0gQHZvbHVtZUJhci53aWR0aCowLjc1XG5cdFx0XHRcdFxuXHRcdG1vdXNlZG93biA9IGZhbHNlXG5cdFx0Z2V0Vm9sdW1lID0gbnVsbFxuXHRcdFxuXHRcdEB2b2x1bWVCYXIub24gRXZlbnRzLlRvdWNoU3RhcnQsIChldmVudCkgLT5cblx0XHRcdG1vdXNlZG93biA9IHRydWVcblx0XHRcdFx0XHRcblx0XHQjIEV2ZW50c1xuXHRcdEZyYW1lci5EZXZpY2Uuc2NyZWVuLm9uIEV2ZW50cy5Ub3VjaE1vdmUsIChldmVudCkgPT5cblx0XHRcdG5ld0ZyYW1lID0gc2NhbGVkU2NyZWVuRnJhbWUoRnJhbWVyLkRldmljZS5zY3JlZW4pXG5cdFx0XHRldmVudFggPSBVdGlscy5yb3VuZChFdmVudHMudG91Y2hFdmVudChldmVudCkuY2xpZW50WCAtIG5ld0ZyYW1lLngsIDEpXG5cdFx0XHR2b2x1bWVXaWR0aCA9IEB2b2x1bWVCYXIud2lkdGggKiBAdm9sdW1lQmFyLnNjcmVlblNjYWxlWCgpXG5cdFx0XHR2b2x1bWVYID0gQHZvbHVtZUJhci54ICogQHZvbHVtZUJhci5zY3JlZW5TY2FsZVgoKVxuXHRcdFx0XHRcblx0XHRcdGdldFZvbHVtZSA9IChldmVudFggLSB2b2x1bWVYKVxuXHRcdFx0Z2V0Vm9sdW1lID0gVXRpbHMubW9kdWxhdGUoZ2V0Vm9sdW1lLCBbMCwgdm9sdW1lV2lkdGhdLCBbMCwxXSwgdHJ1ZSlcblx0XHRcdFx0XHRcdFx0XG5cdFx0XHRpZiBtb3VzZWRvd24gaXMgdHJ1ZVxuXHRcdFx0XHRAcGxheWVyLnZvbHVtZSA9IGdldFZvbHVtZVxuXHRcdFx0XG5cdFx0RnJhbWVyLkRldmljZS5zY3JlZW4ub24gRXZlbnRzLlRvdWNoRW5kLCAoZXZlbnQpID0+XG5cdFx0XHRpZiBtb3VzZWRvd24gaXMgdHJ1ZVxuXHRcdFx0XHRAcGxheWVyLnZvbHVtZSA9IGdldFZvbHVtZVxuXHRcdFx0bW91c2Vkb3duID0gZmFsc2Vcblx0XHRcdFx0XG5cdFx0QHBsYXllci5vbnZvbHVtZWNoYW5nZSA9ID0+XG5cdFx0XHRAdm9sdW1lRmlsbC53aWR0aCA9IEBwbGF5ZXIuYmFzZVZvbHVtZU9uKEB2b2x1bWVCYXIpXG5cbiMgSGVscGVyIEZ1bmN0aW9uc1xuc2NhbGVkU2NyZWVuRnJhbWUgPSAobGF5ZXIpIC0+XG5cdGZyYW1lID0gbGF5ZXIuc2NyZWVuRnJhbWVcblx0ZnJhbWUud2lkdGggICo9IGxheWVyLnNjcmVlblNjYWxlWCgpXG5cdGZyYW1lLmhlaWdodCAqPSBsYXllci5zY3JlZW5TY2FsZVkoKVxuXHRmcmFtZS54ICs9IChsYXllci53aWR0aCAtICBmcmFtZS53aWR0aCkgICogbGF5ZXIub3JpZ2luWFxuXHRmcmFtZS55ICs9IChsYXllci5oZWlnaHQgLSBmcmFtZS5oZWlnaHQpICogbGF5ZXIub3JpZ2luWFxuXHRyZXR1cm4gZnJhbWUiLCIjIEFkZCB0aGUgZm9sbG93aW5nIGxpbmUgdG8geW91ciBwcm9qZWN0IGluIEZyYW1lciBTdHVkaW8uIFxuIyBteU1vZHVsZSA9IHJlcXVpcmUgXCJteU1vZHVsZVwiXG4jIFJlZmVyZW5jZSB0aGUgY29udGVudHMgYnkgbmFtZSwgbGlrZSBteU1vZHVsZS5teUZ1bmN0aW9uKCkgb3IgbXlNb2R1bGUubXlWYXJcblxuZXhwb3J0cy5teVZhciA9IFwibXlWYXJpYWJsZVwiXG5cbmV4cG9ydHMubXlGdW5jdGlvbiA9IC0+XG5cdHByaW50IFwibXlGdW5jdGlvbiBpcyBydW5uaW5nXCJcblxuZXhwb3J0cy5teUFycmF5ID0gWzEsIDIsIDNdIiwiIyMjXG4gIFNob3J0Y3V0cyBmb3IgRnJhbWVyIDEuMFxuICBodHRwOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9zaG9ydGN1dHMtZm9yLWZyYW1lclxuXG4gIENvcHlyaWdodCAoYykgMjAxNCwgRmFjZWJvb2ssIEluYy5cbiAgQWxsIHJpZ2h0cyByZXNlcnZlZC5cblxuICBSZWFkbWU6XG4gIGh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9zaG9ydGN1dHMtZm9yLWZyYW1lclxuXG4gIExpY2Vuc2U6XG4gIGh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9zaG9ydGN1dHMtZm9yLWZyYW1lci9ibG9iL21hc3Rlci9MSUNFTlNFLm1kXG4jIyNcblxuXG5cblxuIyMjXG4gIENPTkZJR1VSQVRJT05cbiMjI1xuXG5zaG9ydGN1dHMgPSB7fVxuXG5GcmFtZXIuRGVmYXVsdHMuRmFkZUFuaW1hdGlvbiA9XG4gIGN1cnZlOiBcImJlemllci1jdXJ2ZVwiXG4gIHRpbWU6IDAuMlxuXG5GcmFtZXIuRGVmYXVsdHMuU2xpZGVBbmltYXRpb24gPVxuICBjdXJ2ZTogXCJzcHJpbmcoNDAwLDQwLDApXCJcblxuXG5cbiMjI1xuICBMT09QIE9OIEVWRVJZIExBWUVSXG5cbiAgU2hvcnRoYW5kIGZvciBhcHBseWluZyBhIGZ1bmN0aW9uIHRvIGV2ZXJ5IGxheWVyIGluIHRoZSBkb2N1bWVudC5cblxuICBFeGFtcGxlOlxuICBgYGBzaG9ydGN1dHMuZXZlcnlMYXllcihmdW5jdGlvbihsYXllcikge1xuICAgIGxheWVyLnZpc2libGUgPSBmYWxzZTtcbiAgfSk7YGBgXG4jIyNcbnNob3J0Y3V0cy5ldmVyeUxheWVyID0gKGZuKSAtPlxuICBmb3IgbGF5ZXJOYW1lIG9mIHdpbmRvdy5MYXllcnNcbiAgICBfbGF5ZXIgPSB3aW5kb3cuTGF5ZXJzW2xheWVyTmFtZV1cbiAgICBmbiBfbGF5ZXJcblxuXG4jIyNcbiAgU0hPUlRIQU5EIEZPUiBBQ0NFU1NJTkcgTEFZRVJTXG5cbiAgQ29udmVydCBlYWNoIGxheWVyIGNvbWluZyBmcm9tIHRoZSBleHBvcnRlciBpbnRvIGEgSmF2YXNjcmlwdCBvYmplY3QgZm9yIHNob3J0aGFuZCBhY2Nlc3MuXG5cbiAgVGhpcyBoYXMgdG8gYmUgY2FsbGVkIG1hbnVhbGx5IGluIEZyYW1lcjMgYWZ0ZXIgeW91J3ZlIHJhbiB0aGUgaW1wb3J0ZXIuXG5cbiAgbXlMYXllcnMgPSBGcmFtZXIuSW1wb3J0ZXIubG9hZChcIi4uLlwiKVxuICBzaG9ydGN1dHMuaW5pdGlhbGl6ZShteUxheWVycylcblxuICBJZiB5b3UgaGF2ZSBhIGxheWVyIGluIHlvdXIgUFNEL1NrZXRjaCBjYWxsZWQgXCJOZXdzRmVlZFwiLCB0aGlzIHdpbGwgY3JlYXRlIGEgZ2xvYmFsIEphdmFzY3JpcHQgdmFyaWFibGUgY2FsbGVkIFwiTmV3c0ZlZWRcIiB0aGF0IHlvdSBjYW4gbWFuaXB1bGF0ZSB3aXRoIEZyYW1lci5cblxuICBFeGFtcGxlOlxuICBgTmV3c0ZlZWQudmlzaWJsZSA9IGZhbHNlO2BcblxuICBOb3RlczpcbiAgSmF2YXNjcmlwdCBoYXMgc29tZSBuYW1lcyByZXNlcnZlZCBmb3IgaW50ZXJuYWwgZnVuY3Rpb24gdGhhdCB5b3UgY2FuJ3Qgb3ZlcnJpZGUgKGZvciBleC4gKVxuICBJZiB5b3UgY2FsbCBpbml0aWFsaXplIHdpdGhvdXQgYW55dGhpbmcsIGl0IHdpbGwgdXNlIGFsbCBjdXJyZW50bHkgYXZhaWxhYmxlIGxheWVycy5cbiMjI1xuc2hvcnRjdXRzLmluaXRpYWxpemUgPSAobGF5ZXJzKSAtPlxuXG4gIGxheWVyID0gRnJhbWVyLkN1cnJlbnRDb250ZXh0Ll9sYXllckxpc3QgaWYgbm90IGxheWVyc1xuXG4gIHdpbmRvdy5MYXllcnMgPSBsYXllcnNcblxuICBzaG9ydGN1dHMuZXZlcnlMYXllciAobGF5ZXIpIC0+XG4gICAgc2FuaXRpemVkTGF5ZXJOYW1lID0gbGF5ZXIubmFtZS5yZXBsYWNlKC9bLSshPzoqXFxbXFxdXFwoXFwpXFwvXS9nLCAnJykudHJpbSgpLnJlcGxhY2UoL1xccy9nLCAnXycpXG4gICAgd2luZG93W3Nhbml0aXplZExheWVyTmFtZV0gPSBsYXllclxuICAgIHNob3J0Y3V0cy5zYXZlT3JpZ2luYWxGcmFtZSBsYXllclxuICAgIHNob3J0Y3V0cy5pbml0aWFsaXplVG91Y2hTdGF0ZXMgbGF5ZXJcblxuXG4jIyNcbiAgRklORCBDSElMRCBMQVlFUlMgQlkgTkFNRVxuXG4gIFJldHJpZXZlcyBzdWJMYXllcnMgb2Ygc2VsZWN0ZWQgbGF5ZXIgdGhhdCBoYXZlIGEgbWF0Y2hpbmcgbmFtZS5cblxuICBnZXRDaGlsZDogcmV0dXJuIHRoZSBmaXJzdCBzdWJsYXllciB3aG9zZSBuYW1lIGluY2x1ZGVzIHRoZSBnaXZlbiBzdHJpbmdcbiAgZ2V0Q2hpbGRyZW46IHJldHVybiBhbGwgc3ViTGF5ZXJzIHRoYXQgbWF0Y2hcblxuICBVc2VmdWwgd2hlbiBlZy4gaXRlcmF0aW5nIG92ZXIgdGFibGUgY2VsbHMuIFVzZSBnZXRDaGlsZCB0byBhY2Nlc3MgdGhlIGJ1dHRvbiBmb3VuZCBpbiBlYWNoIGNlbGwuIFRoaXMgaXMgKipjYXNlIGluc2Vuc2l0aXZlKiouXG5cbiAgRXhhbXBsZTpcbiAgYHRvcExheWVyID0gTmV3c0ZlZWQuZ2V0Q2hpbGQoXCJUb3BcIilgIExvb2tzIGZvciBsYXllcnMgd2hvc2UgbmFtZSBtYXRjaGVzIFRvcC4gUmV0dXJucyB0aGUgZmlyc3QgbWF0Y2hpbmcgbGF5ZXIuXG5cbiAgYGNoaWxkTGF5ZXJzID0gVGFibGUuZ2V0Q2hpbGRyZW4oXCJDZWxsXCIpYCBSZXR1cm5zIGFsbCBjaGlsZHJlbiB3aG9zZSBuYW1lIG1hdGNoIENlbGwgaW4gYW4gYXJyYXkuXG4jIyNcbkxheWVyOjpnZXRDaGlsZCA9IChuZWVkbGUsIHJlY3Vyc2l2ZSA9IGZhbHNlKSAtPlxuICAjIFNlYXJjaCBkaXJlY3QgY2hpbGRyZW5cbiAgZm9yIHN1YkxheWVyIGluIEBzdWJMYXllcnNcbiAgICByZXR1cm4gc3ViTGF5ZXIgaWYgc3ViTGF5ZXIubmFtZS50b0xvd2VyQ2FzZSgpLmluZGV4T2YobmVlZGxlLnRvTG93ZXJDYXNlKCkpIGlzbnQgLTEgXG5cbiAgIyBSZWN1cnNpdmVseSBzZWFyY2ggY2hpbGRyZW4gb2YgY2hpbGRyZW5cbiAgaWYgcmVjdXJzaXZlXG4gICAgZm9yIHN1YkxheWVyIGluIEBzdWJMYXllcnNcbiAgICAgIHJldHVybiBzdWJMYXllci5nZXRDaGlsZChuZWVkbGUsIHJlY3Vyc2l2ZSkgaWYgc3ViTGF5ZXIuZ2V0Q2hpbGQobmVlZGxlLCByZWN1cnNpdmUpIFxuXG5cbkxheWVyOjpnZXRDaGlsZHJlbiA9IChuZWVkbGUsIHJlY3Vyc2l2ZSA9IGZhbHNlKSAtPlxuICByZXN1bHRzID0gW11cblxuICBpZiByZWN1cnNpdmVcbiAgICBmb3Igc3ViTGF5ZXIgaW4gQHN1YkxheWVyc1xuICAgICAgcmVzdWx0cyA9IHJlc3VsdHMuY29uY2F0IHN1YkxheWVyLmdldENoaWxkcmVuKG5lZWRsZSwgcmVjdXJzaXZlKVxuICAgIHJlc3VsdHMucHVzaCBAIGlmIEBuYW1lLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihuZWVkbGUudG9Mb3dlckNhc2UoKSkgaXNudCAtMVxuICAgIHJldHVybiByZXN1bHRzXG5cbiAgZWxzZVxuICAgIGZvciBzdWJMYXllciBpbiBAc3ViTGF5ZXJzXG4gICAgICBpZiBzdWJMYXllci5uYW1lLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihuZWVkbGUudG9Mb3dlckNhc2UoKSkgaXNudCAtMSBcbiAgICAgICAgcmVzdWx0cy5wdXNoIHN1YkxheWVyIFxuICAgIHJldHVybiByZXN1bHRzXG5cblxuXG4jIyNcbiAgQ09OVkVSVCBBIE5VTUJFUiBSQU5HRSBUTyBBTk9USEVSXG5cbiAgQ29udmVydHMgYSBudW1iZXIgd2l0aGluIG9uZSByYW5nZSB0byBhbm90aGVyIHJhbmdlXG5cbiAgRXhhbXBsZTpcbiAgV2Ugd2FudCB0byBtYXAgdGhlIG9wYWNpdHkgb2YgYSBsYXllciB0byBpdHMgeCBsb2NhdGlvbi5cblxuICBUaGUgb3BhY2l0eSB3aWxsIGJlIDAgaWYgdGhlIFggY29vcmRpbmF0ZSBpcyAwLCBhbmQgaXQgd2lsbCBiZSAxIGlmIHRoZSBYIGNvb3JkaW5hdGUgaXMgNjQwLiBBbGwgdGhlIFggY29vcmRpbmF0ZXMgaW4gYmV0d2VlbiB3aWxsIHJlc3VsdCBpbiBpbnRlcm1lZGlhdGUgdmFsdWVzIGJldHdlZW4gMCBhbmQgMS5cblxuICBgbXlMYXllci5vcGFjaXR5ID0gY29udmVydFJhbmdlKDAsIDY0MCwgbXlMYXllci54LCAwLCAxKWBcblxuICBCeSBkZWZhdWx0LCB0aGlzIHZhbHVlIG1pZ2h0IGJlIG91dHNpZGUgdGhlIGJvdW5kcyBvZiBOZXdNaW4gYW5kIE5ld01heCBpZiB0aGUgT2xkVmFsdWUgaXMgb3V0c2lkZSBPbGRNaW4gYW5kIE9sZE1heC4gSWYgeW91IHdhbnQgdG8gY2FwIHRoZSBmaW5hbCB2YWx1ZSB0byBOZXdNaW4gYW5kIE5ld01heCwgc2V0IGNhcHBlZCB0byB0cnVlLlxuICBNYWtlIHN1cmUgTmV3TWluIGlzIHNtYWxsZXIgdGhhbiBOZXdNYXggaWYgeW91J3JlIHVzaW5nIHRoaXMuIElmIHlvdSBuZWVkIGFuIGludmVyc2UgcHJvcG9ydGlvbiwgdHJ5IHN3YXBwaW5nIE9sZE1pbiBhbmQgT2xkTWF4LlxuIyMjXG5zaG9ydGN1dHMuY29udmVydFJhbmdlID0gKE9sZE1pbiwgT2xkTWF4LCBPbGRWYWx1ZSwgTmV3TWluLCBOZXdNYXgsIGNhcHBlZCkgLT5cbiAgT2xkUmFuZ2UgPSAoT2xkTWF4IC0gT2xkTWluKVxuICBOZXdSYW5nZSA9IChOZXdNYXggLSBOZXdNaW4pXG4gIE5ld1ZhbHVlID0gKCgoT2xkVmFsdWUgLSBPbGRNaW4pICogTmV3UmFuZ2UpIC8gT2xkUmFuZ2UpICsgTmV3TWluXG5cbiAgaWYgY2FwcGVkXG4gICAgaWYgTmV3VmFsdWUgPiBOZXdNYXhcbiAgICAgIE5ld01heFxuICAgIGVsc2UgaWYgTmV3VmFsdWUgPCBOZXdNaW5cbiAgICAgIE5ld01pblxuICAgIGVsc2VcbiAgICAgIE5ld1ZhbHVlXG4gIGVsc2VcbiAgICBOZXdWYWx1ZVxuXG5cbiMjI1xuICBPUklHSU5BTCBGUkFNRVxuXG4gIFN0b3JlcyB0aGUgaW5pdGlhbCBsb2NhdGlvbiBhbmQgc2l6ZSBvZiBhIGxheWVyIGluIHRoZSBcIm9yaWdpbmFsRnJhbWVcIiBhdHRyaWJ1dGUsIHNvIHlvdSBjYW4gcmV2ZXJ0IHRvIGl0IGxhdGVyIG9uLlxuXG4gIEV4YW1wbGU6XG4gIFRoZSB4IGNvb3JkaW5hdGUgb2YgTXlMYXllciBpcyBpbml0aWFsbHkgNDAwIChmcm9tIHRoZSBQU0QpXG5cbiAgYGBgTXlMYXllci54ID0gMjAwOyAvLyBub3cgd2Ugc2V0IGl0IHRvIDIwMC5cbiAgTXlMYXllci54ID0gTXlMYXllci5vcmlnaW5hbEZyYW1lLnggLy8gbm93IHdlIHNldCBpdCBiYWNrIHRvIGl0cyBvcmlnaW5hbCB2YWx1ZSwgNDAwLmBgYFxuIyMjXG5zaG9ydGN1dHMuc2F2ZU9yaWdpbmFsRnJhbWUgPSAobGF5ZXIpIC0+XG4gIGxheWVyLm9yaWdpbmFsRnJhbWUgPSBsYXllci5mcmFtZVxuXG4jIyNcbiAgU0hPUlRIQU5EIEhPVkVSIFNZTlRBWFxuXG4gIFF1aWNrbHkgZGVmaW5lIGZ1bmN0aW9ucyB0aGF0IHNob3VsZCBydW4gd2hlbiBJIGhvdmVyIG92ZXIgYSBsYXllciwgYW5kIGhvdmVyIG91dC5cblxuICBFeGFtcGxlOlxuICBgTXlMYXllci5ob3ZlcihmdW5jdGlvbigpIHsgT3RoZXJMYXllci5zaG93KCkgfSwgZnVuY3Rpb24oKSB7IE90aGVyTGF5ZXIuaGlkZSgpIH0pO2BcbiMjI1xuTGF5ZXI6OmhvdmVyID0gKGVudGVyRnVuY3Rpb24sIGxlYXZlRnVuY3Rpb24pIC0+XG4gIHRoaXMub24gJ21vdXNlZW50ZXInLCBlbnRlckZ1bmN0aW9uXG4gIHRoaXMub24gJ21vdXNlbGVhdmUnLCBsZWF2ZUZ1bmN0aW9uXG5cblxuIyMjXG4gIFNIT1JUSEFORCBUQVAgU1lOVEFYXG5cbiAgSW5zdGVhZCBvZiBgTXlMYXllci5vbihFdmVudHMuVG91Y2hFbmQsIGhhbmRsZXIpYCwgdXNlIGBNeUxheWVyLnRhcChoYW5kbGVyKWBcbiMjI1xuXG5MYXllcjo6dGFwID0gKGhhbmRsZXIpIC0+XG4gIHRoaXMub24gRXZlbnRzLlRvdWNoRW5kLCBoYW5kbGVyXG5cblxuIyMjXG4gIFNIT1JUSEFORCBDTElDSyBTWU5UQVhcblxuICBJbnN0ZWFkIG9mIGBNeUxheWVyLm9uKEV2ZW50cy5DbGljaywgaGFuZGxlcilgLCB1c2UgYE15TGF5ZXIuY2xpY2soaGFuZGxlcilgXG4jIyNcblxuTGF5ZXI6OmNsaWNrID0gKGhhbmRsZXIpIC0+XG4gIHRoaXMub24gRXZlbnRzLkNsaWNrLCBoYW5kbGVyXG5cblxuXG4jIyNcbiAgU0hPUlRIQU5EIEFOSU1BVElPTiBTWU5UQVhcblxuICBBIHNob3J0ZXIgYW5pbWF0aW9uIHN5bnRheCB0aGF0IG1pcnJvcnMgdGhlIGpRdWVyeSBzeW50YXg6XG4gIGxheWVyLmFuaW1hdGUocHJvcGVydGllcywgW3RpbWVdLCBbY3VydmVdLCBbY2FsbGJhY2tdKVxuXG4gIEFsbCBwYXJhbWV0ZXJzIGV4Y2VwdCBwcm9wZXJ0aWVzIGFyZSBvcHRpb25hbCBhbmQgY2FuIGJlIG9taXR0ZWQuXG5cbiAgT2xkOlxuICBgYGBNeUxheWVyLmFuaW1hdGUoe1xuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgIHg6IDUwMFxuICAgIH0sXG4gICAgdGltZTogNTAwLFxuICAgIGN1cnZlOiAnYmV6aWVyLWN1cnZlJ1xuICB9KWBgYFxuXG4gIE5ldzpcbiAgYGBgTXlMYXllci5hbmltYXRlVG8oe1xuICAgIHg6IDUwMFxuICB9KWBgYFxuXG4gIE9wdGlvbmFsbHkgKHdpdGggMTAwMG1zIGR1cmF0aW9uIGFuZCBzcHJpbmcpOlxuICAgIGBgYE15TGF5ZXIuYW5pbWF0ZVRvKHtcbiAgICB4OiA1MDBcbiAgfSwgMTAwMCwgXCJzcHJpbmcoMTAwLDEwLDApXCIpXG4jIyNcblxuXG5cbkxheWVyOjphbmltYXRlVG8gPSAocHJvcGVydGllcywgZmlyc3QsIHNlY29uZCwgdGhpcmQpIC0+XG4gIHRoaXNMYXllciA9IHRoaXNcbiAgdGltZSA9IGN1cnZlID0gY2FsbGJhY2sgPSBudWxsXG5cbiAgaWYgdHlwZW9mKGZpcnN0KSA9PSBcIm51bWJlclwiXG4gICAgdGltZSA9IGZpcnN0XG4gICAgaWYgdHlwZW9mKHNlY29uZCkgPT0gXCJzdHJpbmdcIlxuICAgICAgY3VydmUgPSBzZWNvbmRcbiAgICAgIGNhbGxiYWNrID0gdGhpcmRcbiAgICBjYWxsYmFjayA9IHNlY29uZCBpZiB0eXBlb2Yoc2Vjb25kKSA9PSBcImZ1bmN0aW9uXCJcbiAgZWxzZSBpZiB0eXBlb2YoZmlyc3QpID09IFwic3RyaW5nXCJcbiAgICBjdXJ2ZSA9IGZpcnN0XG4gICAgY2FsbGJhY2sgPSBzZWNvbmQgaWYgdHlwZW9mKHNlY29uZCkgPT0gXCJmdW5jdGlvblwiXG4gIGVsc2UgaWYgdHlwZW9mKGZpcnN0KSA9PSBcImZ1bmN0aW9uXCJcbiAgICBjYWxsYmFjayA9IGZpcnN0XG5cbiAgaWYgdGltZT8gJiYgIWN1cnZlP1xuICAgIGN1cnZlID0gJ2Jlemllci1jdXJ2ZSdcbiAgXG4gIGN1cnZlID0gRnJhbWVyLkRlZmF1bHRzLkFuaW1hdGlvbi5jdXJ2ZSBpZiAhY3VydmU/XG4gIHRpbWUgPSBGcmFtZXIuRGVmYXVsdHMuQW5pbWF0aW9uLnRpbWUgaWYgIXRpbWU/XG5cbiAgdGhpc0xheWVyLmFuaW1hdGlvblRvID0gbmV3IEFuaW1hdGlvblxuICAgIGxheWVyOiB0aGlzTGF5ZXJcbiAgICBwcm9wZXJ0aWVzOiBwcm9wZXJ0aWVzXG4gICAgY3VydmU6IGN1cnZlXG4gICAgdGltZTogdGltZVxuXG4gIHRoaXNMYXllci5hbmltYXRpb25Uby5vbiAnc3RhcnQnLCAtPlxuICAgIHRoaXNMYXllci5pc0FuaW1hdGluZyA9IHRydWVcblxuICB0aGlzTGF5ZXIuYW5pbWF0aW9uVG8ub24gJ2VuZCcsIC0+XG4gICAgdGhpc0xheWVyLmlzQW5pbWF0aW5nID0gbnVsbFxuICAgIGlmIGNhbGxiYWNrP1xuICAgICAgY2FsbGJhY2soKVxuXG4gIHRoaXNMYXllci5hbmltYXRpb25Uby5zdGFydCgpXG5cbiMjI1xuICBBTklNQVRFIE1PQklMRSBMQVlFUlMgSU4gQU5EIE9VVCBPRiBUSEUgVklFV1BPUlRcblxuICBTaG9ydGhhbmQgc3ludGF4IGZvciBhbmltYXRpbmcgbGF5ZXJzIGluIGFuZCBvdXQgb2YgdGhlIHZpZXdwb3J0LiBBc3N1bWVzIHRoYXQgdGhlIGxheWVyIHlvdSBhcmUgYW5pbWF0aW5nIGlzIGEgd2hvbGUgc2NyZWVuIGFuZCBoYXMgdGhlIHNhbWUgZGltZW5zaW9ucyBhcyB5b3VyIGNvbnRhaW5lci5cblxuICBFbmFibGUgdGhlIGRldmljZSBwcmV2aWV3IGluIEZyYW1lciBTdHVkaW8gdG8gdXNlIHRoaXMg4oCTwqBpdCBsZXRzIHRoaXMgc2NyaXB0IGZpZ3VyZSBvdXQgd2hhdCB0aGUgYm91bmRzIG9mIHlvdXIgc2NyZWVuIGFyZS5cblxuICBFeGFtcGxlOlxuICAqIGBNeUxheWVyLnNsaWRlVG9MZWZ0KClgIHdpbGwgYW5pbWF0ZSB0aGUgbGF5ZXIgKip0byoqIHRoZSBsZWZ0IGNvcm5lciBvZiB0aGUgc2NyZWVuIChmcm9tIGl0cyBjdXJyZW50IHBvc2l0aW9uKVxuXG4gICogYE15TGF5ZXIuc2xpZGVGcm9tTGVmdCgpYCB3aWxsIGFuaW1hdGUgdGhlIGxheWVyIGludG8gdGhlIHZpZXdwb3J0ICoqZnJvbSoqIHRoZSBsZWZ0IGNvcm5lciAoZnJvbSB4PS13aWR0aClcblxuICBDb25maWd1cmF0aW9uOlxuICAqIChCeSBkZWZhdWx0IHdlIHVzZSBhIHNwcmluZyBjdXJ2ZSB0aGF0IGFwcHJveGltYXRlcyBpT1MuIFRvIHVzZSBhIHRpbWUgZHVyYXRpb24sIGNoYW5nZSB0aGUgY3VydmUgdG8gYmV6aWVyLWN1cnZlLilcbiAgKiBGcmFtZXIuRGVmYXVsdHMuU2xpZGVBbmltYXRpb24udGltZVxuICAqIEZyYW1lci5EZWZhdWx0cy5TbGlkZUFuaW1hdGlvbi5jdXJ2ZVxuXG5cbiAgSG93IHRvIHJlYWQgdGhlIGNvbmZpZ3VyYXRpb246XG4gIGBgYHNsaWRlRnJvbUxlZnQ6XG4gICAgcHJvcGVydHk6IFwieFwiICAgICAvLyBhbmltYXRlIGFsb25nIHRoZSBYIGF4aXNcbiAgICBmYWN0b3I6IFwid2lkdGhcIlxuICAgIGZyb206IC0xICAgICAgICAgIC8vIHN0YXJ0IHZhbHVlOiBvdXRzaWRlIHRoZSBsZWZ0IGNvcm5lciAoIHggPSAtd2lkdGhfcGhvbmUgKVxuICAgIHRvOiAwICAgICAgICAgICAgIC8vIGVuZCB2YWx1ZTogaW5zaWRlIHRoZSBsZWZ0IGNvcm5lciAoIHggPSB3aWR0aF9sYXllciApXG4gIGBgYFxuIyMjXG5cblxuc2hvcnRjdXRzLnNsaWRlQW5pbWF0aW9ucyA9XG4gIHNsaWRlRnJvbUxlZnQ6XG4gICAgcHJvcGVydHk6IFwieFwiXG4gICAgZmFjdG9yOiBcIndpZHRoXCJcbiAgICBmcm9tOiAtMVxuICAgIHRvOiAwXG5cbiAgc2xpZGVUb0xlZnQ6XG4gICAgcHJvcGVydHk6IFwieFwiXG4gICAgZmFjdG9yOiBcIndpZHRoXCJcbiAgICB0bzogLTFcblxuICBzbGlkZUZyb21SaWdodDpcbiAgICBwcm9wZXJ0eTogXCJ4XCJcbiAgICBmYWN0b3I6IFwid2lkdGhcIlxuICAgIGZyb206IDFcbiAgICB0bzogMFxuXG4gIHNsaWRlVG9SaWdodDpcbiAgICBwcm9wZXJ0eTogXCJ4XCJcbiAgICBmYWN0b3I6IFwid2lkdGhcIlxuICAgIHRvOiAxXG5cbiAgc2xpZGVGcm9tVG9wOlxuICAgIHByb3BlcnR5OiBcInlcIlxuICAgIGZhY3RvcjogXCJoZWlnaHRcIlxuICAgIGZyb206IC0xXG4gICAgdG86IDBcblxuICBzbGlkZVRvVG9wOlxuICAgIHByb3BlcnR5OiBcInlcIlxuICAgIGZhY3RvcjogXCJoZWlnaHRcIlxuICAgIHRvOiAtMVxuXG4gIHNsaWRlRnJvbUJvdHRvbTpcbiAgICBwcm9wZXJ0eTogXCJ5XCJcbiAgICBmYWN0b3I6IFwiaGVpZ2h0XCJcbiAgICBmcm9tOiAxXG4gICAgdG86IDBcblxuICBzbGlkZVRvQm90dG9tOlxuICAgIHByb3BlcnR5OiBcInlcIlxuICAgIGZhY3RvcjogXCJoZWlnaHRcIlxuICAgIHRvOiAxXG5cblxuXG5fLmVhY2ggc2hvcnRjdXRzLnNsaWRlQW5pbWF0aW9ucywgKG9wdHMsIG5hbWUpIC0+XG4gIExheWVyLnByb3RvdHlwZVtuYW1lXSA9ICh0aW1lKSAtPlxuICAgIF9waG9uZSA9IEZyYW1lci5EZXZpY2U/LnNjcmVlbj8uZnJhbWVcblxuICAgIHVubGVzcyBfcGhvbmVcbiAgICAgIGVyciA9IFwiUGxlYXNlIHNlbGVjdCBhIGRldmljZSBwcmV2aWV3IGluIEZyYW1lciBTdHVkaW8gdG8gdXNlIHRoZSBzbGlkZSBwcmVzZXQgYW5pbWF0aW9ucy5cIlxuICAgICAgcHJpbnQgZXJyXG4gICAgICBjb25zb2xlLmxvZyBlcnJcbiAgICAgIHJldHVyblxuXG4gICAgX3Byb3BlcnR5ID0gb3B0cy5wcm9wZXJ0eVxuICAgIF9mYWN0b3IgPSBfcGhvbmVbb3B0cy5mYWN0b3JdXG5cbiAgICBpZiBvcHRzLmZyb20/XG4gICAgICAjIEluaXRpYXRlIHRoZSBzdGFydCBwb3NpdGlvbiBvZiB0aGUgYW5pbWF0aW9uIChpLmUuIG9mZiBzY3JlZW4gb24gdGhlIGxlZnQgY29ybmVyKVxuICAgICAgdGhpc1tfcHJvcGVydHldID0gb3B0cy5mcm9tICogX2ZhY3RvclxuXG4gICAgIyBEZWZhdWx0IGFuaW1hdGlvbiBzeW50YXggbGF5ZXIuYW5pbWF0ZSh7X3Byb3BlcnR5OiAwfSkgd291bGQgdHJ5IHRvIGFuaW1hdGUgJ19wcm9wZXJ0eScgbGl0ZXJhbGx5LCBpbiBvcmRlciBmb3IgaXQgdG8gYmxvdyB1cCB0byB3aGF0J3MgaW4gaXQgKGVnIHgpLCB3ZSB1c2UgdGhpcyBzeW50YXhcbiAgICBfYW5pbWF0aW9uQ29uZmlnID0ge31cbiAgICBfYW5pbWF0aW9uQ29uZmlnW19wcm9wZXJ0eV0gPSBvcHRzLnRvICogX2ZhY3RvclxuXG4gICAgaWYgdGltZVxuICAgICAgX3RpbWUgPSB0aW1lXG4gICAgICBfY3VydmUgPSBcImJlemllci1jdXJ2ZVwiXG4gICAgZWxzZVxuICAgICAgX3RpbWUgPSBGcmFtZXIuRGVmYXVsdHMuU2xpZGVBbmltYXRpb24udGltZVxuICAgICAgX2N1cnZlID0gRnJhbWVyLkRlZmF1bHRzLlNsaWRlQW5pbWF0aW9uLmN1cnZlXG5cbiAgICB0aGlzLmFuaW1hdGVcbiAgICAgIHByb3BlcnRpZXM6IF9hbmltYXRpb25Db25maWdcbiAgICAgIHRpbWU6IF90aW1lXG4gICAgICBjdXJ2ZTogX2N1cnZlXG5cblxuXG4jIyNcbiAgRUFTWSBGQURFIElOIC8gRkFERSBPVVRcblxuICAuc2hvdygpIGFuZCAuaGlkZSgpIGFyZSBzaG9ydGN1dHMgdG8gYWZmZWN0IG9wYWNpdHkgYW5kIHBvaW50ZXIgZXZlbnRzLiBUaGlzIGlzIGVzc2VudGlhbGx5IHRoZSBzYW1lIGFzIGhpZGluZyB3aXRoIGB2aXNpYmxlID0gZmFsc2VgIGJ1dCBjYW4gYmUgYW5pbWF0ZWQuXG5cbiAgLmZhZGVJbigpIGFuZCAuZmFkZU91dCgpIGFyZSBzaG9ydGN1dHMgdG8gZmFkZSBpbiBhIGhpZGRlbiBsYXllciwgb3IgZmFkZSBvdXQgYSB2aXNpYmxlIGxheWVyLlxuXG4gIFRoZXNlIHNob3J0Y3V0cyB3b3JrIG9uIGluZGl2aWR1YWwgbGF5ZXIgb2JqZWN0cyBhcyB3ZWxsIGFzIGFuIGFycmF5IG9mIGxheWVycy5cblxuICBFeGFtcGxlOlxuICAqIGBNeUxheWVyLmZhZGVJbigpYCB3aWxsIGZhZGUgaW4gTXlMYXllciB1c2luZyBkZWZhdWx0IHRpbWluZy5cbiAgKiBgW015TGF5ZXIsIE90aGVyTGF5ZXJdLmZhZGVPdXQoNClgIHdpbGwgZmFkZSBvdXQgYm90aCBNeUxheWVyIGFuZCBPdGhlckxheWVyIG92ZXIgNCBzZWNvbmRzLlxuXG4gIFRvIGN1c3RvbWl6ZSB0aGUgZmFkZSBhbmltYXRpb24sIGNoYW5nZSB0aGUgdmFyaWFibGVzIHRpbWUgYW5kIGN1cnZlIGluc2lkZSBgRnJhbWVyLkRlZmF1bHRzLkZhZGVBbmltYXRpb25gLlxuIyMjXG5MYXllcjo6c2hvdyA9IC0+XG4gIEBvcGFjaXR5ID0gMVxuICBAc3R5bGUucG9pbnRlckV2ZW50cyA9ICdhdXRvJ1xuICBAXG5cbkxheWVyOjpoaWRlID0gLT5cbiAgQG9wYWNpdHkgPSAwXG4gIEBzdHlsZS5wb2ludGVyRXZlbnRzID0gJ25vbmUnXG4gIEBcblxuTGF5ZXI6OmZhZGVJbiA9ICh0aW1lID0gRnJhbWVyLkRlZmF1bHRzLkZhZGVBbmltYXRpb24udGltZSkgLT5cbiAgcmV0dXJuIGlmIEBvcGFjaXR5ID09IDFcblxuICB1bmxlc3MgQHZpc2libGVcbiAgICBAb3BhY2l0eSA9IDBcbiAgICBAdmlzaWJsZSA9IHRydWVcblxuICBAYW5pbWF0ZVRvIG9wYWNpdHk6IDEsIHRpbWUsIEZyYW1lci5EZWZhdWx0cy5GYWRlQW5pbWF0aW9uLmN1cnZlXG5cbkxheWVyOjpmYWRlT3V0ID0gKHRpbWUgPSBGcmFtZXIuRGVmYXVsdHMuRmFkZUFuaW1hdGlvbi50aW1lKSAtPlxuICByZXR1cm4gaWYgQG9wYWNpdHkgPT0gMFxuXG4gIHRoYXQgPSBAXG4gIEBhbmltYXRlVG8gb3BhY2l0eTogMCwgdGltZSwgRnJhbWVyLkRlZmF1bHRzLkZhZGVBbmltYXRpb24uY3VydmUsIC0+IHRoYXQuc3R5bGUucG9pbnRlckV2ZW50cyA9ICdub25lJ1xuXG4jIGFsbCBvZiB0aGUgZWFzeSBpbi9vdXQgaGVscGVycyB3b3JrIG9uIGFuIGFycmF5IG9mIHZpZXdzIGFzIHdlbGwgYXMgaW5kaXZpZHVhbCB2aWV3c1xuXy5lYWNoIFsnc2hvdycsICdoaWRlJywgJ2ZhZGVJbicsICdmYWRlT3V0J10sIChmblN0cmluZyktPiAgXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSBBcnJheS5wcm90b3R5cGUsIGZuU3RyaW5nLCBcbiAgICBlbnVtZXJhYmxlOiBmYWxzZVxuICAgIHZhbHVlOiAodGltZSkgLT5cbiAgICAgIF8uZWFjaCBALCAobGF5ZXIpIC0+XG4gICAgICAgIExheWVyLnByb3RvdHlwZVtmblN0cmluZ10uY2FsbChsYXllciwgdGltZSkgaWYgbGF5ZXIgaW5zdGFuY2VvZiBMYXllclxuICAgICAgQFxuXG5cbiMjI1xuICBFQVNZIEhPVkVSIEFORCBUT1VDSC9DTElDSyBTVEFURVMgRk9SIExBWUVSU1xuXG4gIEJ5IG5hbWluZyB5b3VyIGxheWVyIGhpZXJhcmNoeSBpbiB0aGUgZm9sbG93aW5nIHdheSwgeW91IGNhbiBhdXRvbWF0aWNhbGx5IGhhdmUgeW91ciBsYXllcnMgcmVhY3QgdG8gaG92ZXJzLCBjbGlja3Mgb3IgdGFwcy5cblxuICBCdXR0b25fdG91Y2hhYmxlXG4gIC0gQnV0dG9uX2RlZmF1bHQgKGRlZmF1bHQgc3RhdGUpXG4gIC0gQnV0dG9uX2Rvd24gKHRvdWNoL2NsaWNrIHN0YXRlKVxuICAtIEJ1dHRvbl9ob3ZlciAoaG92ZXIpXG4jIyNcblxuc2hvcnRjdXRzLmluaXRpYWxpemVUb3VjaFN0YXRlcyA9IChsYXllcikgLT5cbiAgX2RlZmF1bHQgPSBsYXllci5nZXRDaGlsZCgnZGVmYXVsdCcpXG5cbiAgaWYgbGF5ZXIubmFtZS50b0xvd2VyQ2FzZSgpLmluZGV4T2YoJ3RvdWNoYWJsZScpIGFuZCBfZGVmYXVsdFxuXG4gICAgdW5sZXNzIEZyYW1lci5VdGlscy5pc01vYmlsZSgpXG4gICAgICBfaG92ZXIgPSBsYXllci5nZXRDaGlsZCgnaG92ZXInKVxuICAgIF9kb3duID0gbGF5ZXIuZ2V0Q2hpbGQoJ2Rvd24nKVxuXG4gICAgIyBUaGVzZSBsYXllcnMgc2hvdWxkIGJlIGhpZGRlbiBieSBkZWZhdWx0XG4gICAgX2hvdmVyPy5oaWRlKClcbiAgICBfZG93bj8uaGlkZSgpXG5cbiAgICAjIENyZWF0ZSBmYWtlIGhpdCB0YXJnZXQgKHNvIHdlIGRvbid0IHJlLWZpcmUgZXZlbnRzKVxuICAgIGlmIF9ob3ZlciBvciBfZG93blxuICAgICAgaGl0VGFyZ2V0ID0gbmV3IExheWVyXG4gICAgICAgIGJhY2tncm91bmQ6ICd0cmFuc3BhcmVudCdcbiAgICAgICAgZnJhbWU6IF9kZWZhdWx0LmZyYW1lXG5cbiAgICAgIGhpdFRhcmdldC5zdXBlckxheWVyID0gbGF5ZXJcbiAgICAgIGhpdFRhcmdldC5icmluZ1RvRnJvbnQoKVxuXG4gICAgIyBUaGVyZSBpcyBhIGhvdmVyIHN0YXRlLCBzbyBkZWZpbmUgaG92ZXIgZXZlbnRzIChub3QgZm9yIG1vYmlsZSlcbiAgICBpZiBfaG92ZXJcbiAgICAgIGxheWVyLmhvdmVyIC0+XG4gICAgICAgIF9kZWZhdWx0LmhpZGUoKVxuICAgICAgICBfaG92ZXIuc2hvdygpXG4gICAgICAsIC0+XG4gICAgICAgIF9kZWZhdWx0LnNob3coKVxuICAgICAgICBfaG92ZXIuaGlkZSgpXG5cbiAgICAjIFRoZXJlIGlzIGEgZG93biBzdGF0ZSwgc28gZGVmaW5lIGRvd24gZXZlbnRzXG4gICAgaWYgX2Rvd25cbiAgICAgIGxheWVyLm9uIEV2ZW50cy5Ub3VjaFN0YXJ0LCAtPlxuICAgICAgICBfZGVmYXVsdC5oaWRlKClcbiAgICAgICAgX2hvdmVyPy5oaWRlKCkgIyB0b3VjaCBkb3duIHN0YXRlIG92ZXJyaWRlcyBob3ZlciBzdGF0ZVxuICAgICAgICBfZG93bi5zaG93KClcblxuICAgICAgbGF5ZXIub24gRXZlbnRzLlRvdWNoRW5kLCAtPlxuICAgICAgICBfZG93bi5oaWRlKClcblxuICAgICAgICBpZiBfaG92ZXJcbiAgICAgICAgICAjIElmIHRoZXJlIHdhcyBhIGhvdmVyIHN0YXRlLCBnbyBiYWNrIHRvIHRoZSBob3ZlciBzdGF0ZVxuICAgICAgICAgIF9ob3Zlci5zaG93KClcbiAgICAgICAgZWxzZVxuICAgICAgICAgIF9kZWZhdWx0LnNob3coKVxuXG5cbl8uZXh0ZW5kKGV4cG9ydHMsIHNob3J0Y3V0cylcblxuIl19
