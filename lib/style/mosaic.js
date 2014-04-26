'use strict';

var Style = require('./style');
var Palette = require('../palette').Palette;
var utils = require('../utils');
var extend = utils.extend;


/**
 *
 */
function Mosaic(options) {

  this.config = extend(true, {}, Mosaic.defaults, options);

  if (this.config.palette instanceof Palette) {
    this.palette = this.config.palette;
  } else {
    this.palette = new Palette(this.config.palette);
  }
}

utils.inherits(Mosaic, Style);


/**
 *
 */
Mosaic.defaults = {
  palette: {}
};


/**
 *
 */
Mosaic.prototype.paintRectangle = function(context, x, y, width, height, color) {
  context.fillStyle = color.toString();
  context.fillRect(x, y, width, height);
};


/**
 *
 */
Mosaic.prototype.apply = function(context, x, y, width, height, r, g, b) {


  var palette = this.palette;
  var color = palette.createFromRGB(r, g, b);

  // shuffle(colors);

  this.paintRectangle(context, x, y, width, height, color.toRGB());
};


module.exports = Mosaic;