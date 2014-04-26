'use strict';

var utils = require('../utils');
var Palette = require('./palette');
var Grayscale = require('../color/grayscale');

var inherits = utils.inherits;
var randomInt = utils.randomInt;


/**
 *
 */
var GrayscalePalette = inherits(Palette);


/**
 *
 */
GrayscalePalette.prototype.create = function(y) {
  return new this.Grayscale(y);
};


/**
 *
 */
GrayscalePalette.prototype.createFromRGB = function(r, g, b) {
  return new this.RGB(r, g, b).toGrayscale();
};


/**
 *
 */
GrayscalePalette.prototype.getRandomNeighbors = function(grayscale) {

  var y = grayscale.y;

  // Determine shorter distance to a bounds
  var yRange = Math.min(Grayscale.MAX_VALUE - y, y - Grayscale.MIN_VALUE);

  // Get a random integer on either side of the color
  var yRandom = randomInt(-yRange, yRange);

  // Move from current position
  var y1 = y + yRandom;

  var random = new grayscale.constructor(y1);

  var y2 = y - yRandom;

  var opposite = new grayscale.constructor(y2);

  return [random, opposite];
};


module.exports = GrayscalePalette;