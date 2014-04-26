'use strict';

var utils = require('../utils');
var Palette = require('./palette');
var RGB = require('../color/RGB');

var inherits = utils.inherits;
var randomInt = utils.randomInt;


/**
 *
 */
var RGBPalette = inherits(Palette);


/**
 *
 */
RGBPalette.prototype.create = function(r, g, b) {
  return new this.RGB(r, g, b);
};


/**
 *
 */
RGBPalette.prototype.createFromRGB = function(r, g, b) {
  return this.create(r, g, b);
};


/**
 *
 */
RGBPalette.prototype.createRandom = function() {
  var r = this.RGB.randomValue();
  var g = this.RGB.randomValue();
  var b = this.RGB.randomValue();
  return new this.RGB(r, g, b);
};


/**
 *
 */
RGBPalette.prototype.getRandomNeighbors = function(rgb) {

  var r = rgb.r;
  var g = rgb.g;
  var b = rgb.b;

  // Determine shorter distance to a bounds
  var rRange = Math.min(RGB.MAX_VALUE - r, r - RGB.MIN_VALUE);
  var gRange = Math.min(RGB.MAX_VALUE - g, g - RGB.MIN_VALUE);
  var bRange = Math.min(RGB.MAX_VALUE - b, b - RGB.MIN_VALUE);

  var dampen = 0.9;

  // Get a random integer on either side of the color
  var rRandom = randomInt(-rRange, rRange) * dampen;
  var gRandom = randomInt(-gRange, gRange) * dampen;
  var bRandom = randomInt(-bRange, bRange) * dampen;

  // Move from current position
  var r1 = r + rRandom;
  var g1 = g + gRandom;
  var b1 = b + bRandom;

  var random = new rgb.constructor(r1, g1, b1);

  var r2 = r - rRandom;
  var g2 = g - gRandom;
  var b2 = b - bRandom;

  var opposite = new rgb.constructor(r2, g2, b2);

  return [random, opposite];
};

module.exports = RGBPalette;