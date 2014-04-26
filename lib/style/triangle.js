'use strict';

var Style = require('./style');
var Palette = require('../palette').Palette;
var utils = require('../utils');
var extend = utils.extend;


/**
 *
 */
function Triangle(options) {

  this.config = extend(true, {}, Triangle.defaults, options);

  if (this.config.palette instanceof Palette) {
    this.palette = this.config.palette;
  } else {
    this.palette = new Palette(this.config.palette);
  }
}

utils.inherits(Triangle, Style);


/**
 *
 */
Triangle.defaults = {
  palette: {}
};


/**
 *
 */
Triangle.prototype.paintRectangle = function(context, x, y, width, height, color) {
  context.fillStyle = color.toString();
  context.fillRect(x, y, width, height);
};


/**
 *
 */
Triangle.prototype.apply = function(context, x, y, width, height, r, g, b) {

  var palette = this.palette;
  var color = palette.createFromRGB(r, g, b);
  var neighbors = palette.getRandomNeighbors(color);

  if (this.config.random && Math.random() > 0.5) {
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(x + width, y);
    context.lineTo(x, y + height);
    context.lineTo(x, y);
    context.fillStyle = neighbors[0].toRGB().toString();
    context.fill();
    context.closePath();

    context.beginPath();
    context.moveTo(x, y + height);
    context.lineTo(x + width, y);
    context.lineTo(x + width, y + height);
    context.lineTo(x, y + height);
    context.fillStyle = neighbors[1].toRGB().toString();
    context.fill();
    context.closePath();
  } else {

    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(x + width, y);
    context.lineTo(x + width, y + height);
    context.lineTo(x, y);
    context.fillStyle = neighbors[0].toRGB().toString();
    context.fill();
    context.closePath();

    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(x + width, y + height);
    context.lineTo(x, y + height);
    context.lineTo(x, y);
    context.fillStyle = neighbors[1].toRGB().toString();
    context.fill();
    context.closePath();
  }
};


module.exports = Triangle;