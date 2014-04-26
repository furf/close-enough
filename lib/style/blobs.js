'use strict';

var Style = require('./style');
var Palette = require('../palette').Palette;
var utils = require('../utils');
var extend = utils.extend;
var getRadiusFromArea = utils.getRadiusFromArea;
var shuffle = utils.shuffle;
var random = utils.random;
var randomInt = utils.randomInt;
var toRadians = utils.toRadians;

/**
 *
 */
function Blobs(options) {

  this.config = extend(true, {}, Blobs.defaults, options);

  if (this.config.palette instanceof Palette) {
    this.palette = this.config.palette;
  } else {
    this.palette = new Palette(this.config.palette);
  }
}

utils.inherits(Blobs, Style);


/**
 *
 */
Blobs.defaults = {
  depth: 5,
  palette: {}
};


/**
 *
 */
Blobs.prototype.paintRectangle = function(context, x, y, width, height, color) {
  context.fillStyle = color.toString();
  context.fillRect(x, y, width, height);
};


/**
 *
 */
Blobs.prototype.paintBlob = function(context, x, y, width, height, color) {

  var offsetX = x + width / 2;
  var offsetY = y + height / 2;

  var variance = 0.03125;

  function toX(n) {
    return (n - 0.5) * width + random(-variance, variance);
  }

  function toY(n) {
    return (n - 0.5) * height + random(-variance, variance);
  }

  var r = random(-180, 180);
  
  context.save();
  
  context.translate(offsetX, offsetY);
  context.rotate(toRadians(r));
  
  context.moveTo(toX(1), toY(0.5));
  context.beginPath();
  context.bezierCurveTo(toX(1), toY(0.87839), toX(0.77674), toY(1), toX(0.5), toY(0.98564));
  context.bezierCurveTo(toX(0.22326), toY(0.90312), toX(0), toY(0.7026), toX(0), toY(0.5));
  context.bezierCurveTo(toX(0), toY(0.29741), toX(0.22326), toY(0.09687), toX(0.5), toY(0.01436));
  context.bezierCurveTo(toX(0.77674), toY(0), toX(1), toY(0.12163), toX(1), toY(0.5));
  
  context.rotate(toRadians(-r));
  context.closePath();

  // context.scale(0.25, 0.35);
  context.lineWidth = width / 3;
  context.strokeStyle = color.toString();
  context.stroke();
  
  
  context.restore();

  
};


/**
 *
 */
Blobs.prototype.apply = function(context, x, y, width, height, r, g, b) {


  var palette = this.palette;
  var color = palette.createFromRGB(r, g, b);
  var colors = [color];
  var depth = this.config.depth;
  var i;
  var n;
  var area = width * height;
  var w;
  var h;
  var midX = x + width / 2;
  var midY = y + height / 2;

  for (i = 1; i < depth; ++i) {
    colors.push.apply(colors, palette.getRandomNeighbors(colors.pop()));
  }

  shuffle(colors);

  this.paintRectangle(context, x, y, width, height, colors[0].toRGB());

  for (i = 1, n = colors.length; i < n; ++i) {
    area /= 2;
    w = h = Math.sqrt(area);
    this.paintBlob(context, x + (width - w) / 2, y + (height - h) / 2, w, h, colors[i].toRGB());
  }
};


module.exports = Blobs;
