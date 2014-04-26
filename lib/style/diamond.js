'use strict';

var Style = require('./style');
var Palette = require('../palette').Palette;
var utils = require('../utils');
var extend = utils.extend;


/**
 *
 */
function Diamond(options) {

  this.config = extend(true, {}, Diamond.defaults, options);

  if (this.config.palette instanceof Palette) {
    this.palette = this.config.palette;
  } else {
    this.palette = new Palette(this.config.palette);
  }
}

utils.inherits(Diamond, Style);


/**
 *
 */
Diamond.defaults = {
  scale: 1,
  palette: {}
};


/**
 *
 */
Diamond.prototype.paintRectangle = function(context, x, y, width, height, color) {

  var scale = this.config.scale;

  var scaledWidth = width * scale;
  var scaledHeight = height * scale;
  
  var diffWidth = scaledWidth - width;
  var diffHeight = scaledHeight - height;
  
  var offsetX = diffWidth / 2;
  var offsetY = diffHeight / 2;

  var left = x - offsetX;
  var top = y - offsetY;
  
  var right = left + scaledWidth;
  var bottom = top + scaledHeight;
  
  var midX = left + scaledWidth / 2;
  var midY = top + scaledHeight / 2;

  context.beginPath();
  context.lineTo(midX, top);
  context.lineTo(right, midY);
  context.lineTo(midX, bottom);  
  context.lineTo(left, midY);  
  context.lineTo(midX, top);
  context.closePath();

  context.fillStyle = color.toString();
  context.fill();
};


/**
 *
 */
Diamond.prototype.apply = function(context, x, y, width, height, r, g, b) {


  var palette = this.palette;
  var color = palette.createFromRGB(r, g, b);

  // shuffle(colors);

  this.paintRectangle(context, x, y, width, height, color.toRGB());
};


module.exports = Diamond;