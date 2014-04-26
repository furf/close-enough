'use strict';

var utils = require('../utils');
var Palette = require('./palette');
var Lab = require('../color/lab');

var inherits = utils.inherits;
var randomInt = utils.randomInt;


/**
 *
 */
var LabPalette = utils.inherits(Palette);


/**
 *
 */
LabPalette.prototype.create = function(l, a, b) {
  return new this.Lab(l, a, b);
};


/**
 *
 */
LabPalette.prototype.createFromRGB = function(r, g, b) {
  return new this.RGB(r, g, b).toLab();
};


/**
 *
 */
LabPalette.prototype.createRandom = function() {
  var l = this.Lab.randomValueL();
  var a = this.Lab.randomValueAB();
  var b = this.Lab.randomValueAB();
  return new this.Lab(l, a, b);
};


/**
 * 
 */
LabPalette.prototype.getRandomNeighbors = function(lab) {

  var l = lab.l;
  var a = lab.a;
  var b = lab.b;

  // Determine shorter distance to a bounds
  var lRange = Math.min(Lab.MAX_VALUE_L - l, l - Lab.MIN_VALUE_L);
  var aRange = Math.min(Lab.MAX_VALUE_AB - a, a - Lab.MIN_VALUE_AB);
  var bRange = Math.min(Lab.MAX_VALUE_AB - b, b - Lab.MIN_VALUE_AB);

  // Reduce the effect on the edges of the lightness spectrum
  // var dampen = Math.sin(l / 100 * Math.PI) * 0.2 + 0.1;
// 
  // Get a random integer on either side of the color
  var lRandom = randomInt(-lRange, lRange);
  var aRandom = randomInt(-aRange, aRange) * 0.2;
  var bRandom = randomInt(-bRange, bRange) * 0.2;

  var random = new lab.constructor(
    l + lRandom,
    a + aRandom,
    b + bRandom
  );

  var opposite = new lab.constructor(
    l - lRandom,
    a - aRandom,
    b - bRandom
  );

  return [random, opposite];
};


module.exports = LabPalette;