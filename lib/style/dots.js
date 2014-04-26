'use strict';

var Style = require('./style');
var Palette = require('../palette').Palette;
var utils = require('../utils');
var extend = utils.extend;
var getRadiusFromArea = utils.getRadiusFromArea;
var shuffle = utils.shuffle;


/**
 *
 */
function Dots(options) {

  this.config = extend(true, {}, Dots.defaults, options);

  if (this.config.palette instanceof Palette) {
    this.palette = this.config.palette;
  } else {
    this.palette = new Palette(this.config.palette);
  }
}

utils.inherits(Dots, Style);


/**
 *
 */
Dots.defaults = {
  depth: 5,
  palette: {}
};


/**
 *
 */
Dots.prototype.paintRectangle = function(context, x, y, width, height, color) {
  context.fillStyle = color.toString();
  context.fillRect(x, y, width, height);
};


/**
 *
 */
Dots.prototype.paintCircle = function(context, x, y, radius, color) {
  context.beginPath();
  context.arc(x, y, radius, 0, Math.PI * 2);
  context.closePath();
  context.fillStyle = color.toString();
  context.fill();
};


/**
 *
 */
Dots.prototype.apply = function(context, x, y, width, height, r, g, b) {


  var palette = this.palette;
  var color = palette.createFromRGB(r, g, b);
  var colors = [color];
  var depth = this.config.depth;
  var i;
  var n;
  var midX = x + width / 2;
  var midY = y + height / 2;
  var area = width * height;
  var radius;

  for (i = 1; i < depth; ++i) {
    colors.push.apply(colors, palette.getRandomNeighbors(colors.pop()));
  }

  // shuffle(colors);

  this.paintRectangle(context, x, y, width, height, colors[0].toRGB());

  for (i = 1, n = colors.length; i < n; ++i) {
    area /= 2;
    radius = getRadiusFromArea(area);
    this.paintCircle(context, midX, midY, radius, colors[i].toRGB());
  }
};


module.exports = Dots;