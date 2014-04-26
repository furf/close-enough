'use strict';


// Dependencies
var utils = require('./utils');
var Maquette = require('./maquette');
var Style = require('./style').Style;
var Palette = require('./palette');


// Shortcuts
var extend = utils.extend;
var toRadians = utils.toRadians;


/**
 *
 */
function Head(source, options) {

  // Configure instance
  this.config = extend(true, {}, Head.defaults, options);

  if (this.config.maquette instanceof Maquette) {
    this.maquette = this.config.maquette;
  } else {
    this.maquette = new Maquette(source, this.config.maquette);
  }

  if (this.config.style instanceof Style) {
    this.style = this.config.style;
  } else {
    this.style = new Style(this.config.style);
  }

  this.width = this.maquette.scaledWidth * this.config.size;
  this.height = this.maquette.scaledHeight * this.config.size;

  this.canvas = this.config.canvas || document.createElement('canvas');
  this.context = this.canvas.getContext('2d');
}


/**
 *
 */
Head.defaults = {
  size: 10,
  maquette: {
    angle: 0,
    background: 'rgba(0, 0, 0, 0)',
    scale: 0.1,
  },
  style: {}
};


/**
 *
 */
Head.prototype.render = function() {

  var maquette = this.maquette;
  var palette = this.palette;
  var style = this.style;
  var context = this.context;

  var w = maquette.width;
  var h = maquette.height;
  var y;
  var x;
  var offsetY;
  var offsetX;
  var i = 0;
  var size = this.config.size;
  var rgba = maquette.getImageData().data;
  var rgb;


  // Reset canvas
  this.canvas.width = this.width;
  this.canvas.height = this.height;

  if (maquette.angle) {
    context.rotate(toRadians(-maquette.angle));
    context.translate(-maquette.offsetX * size, -maquette.offsetY * size);
  }

  for (y = 0; y < h; ++y) {
    offsetY = y * size;
    for (x = 0; x < w; ++x) {
      offsetX = x * size;

      // Paint!
      style.apply(context, offsetX, offsetY, size, size, rgba[i++], rgba[i++], rgba[i++]);

      // Pour some out for our alpha dogs
      i++;

    }
  }
};


/**
 *
 */
Head.prototype.getImage = function() {
  this.render();
  return this.canvas;
};


/**
 *
 */
Head.prototype.getImageData = function() {
  this.render();
  return this.context.getImageData(0, 0, this.width, this.height);
};

module.exports = Head;