'use strict';

/**
 * Dependencies
 */
var utils = require('../utils');
var clamp = utils.clamp;
var randomInt = utils.randomInt;

// Constructor


/**
 * Create an Grayscale color
 */
function Grayscale(y) {
  this.setY(y);
}


// Public static constants


/**
 * Minimum valid value for an Grayscale component
 */
Grayscale.MIN_VALUE = 0;


/**
 * Maximum valid value for an Grayscale component
 */
Grayscale.MAX_VALUE = 255;


/**
 * Median value for an Grayscale component (used for bounding)
 */
Grayscale.MID_VALUE = (Grayscale.MAX_VALUE + Grayscale.MIN_VALUE) / 2;



// Public static methods


/**
 * Coerce the value of a component into the valid value range
 */
Grayscale.normalizeComponent = function(component) {
  return clamp(Math.round(component), Grayscale.MIN_VALUE, Grayscale.MAX_VALUE);
};


/**
 * Check the validity of a component value
 */
Grayscale.validateComponent = function(component) {
  return component >= Grayscale.MIN_VALUE && component <= Grayscale.MAX_VALUE;
};


/**
 * Check the validity of a color
 */
Grayscale.validate = function(y) {
  return Grayscale.validateComponent(y);
};


/**
 * Return a random Grayscale component value
 * @returns {Number} random integer
 */
Grayscale.randomValue = function() {
  return randomInt(Grayscale.MIN_VALUE, Grayscale.MAX_VALUE);
};


// Private static methods


/**
 * components are presumed normalized
 */
function _componentToHex(component) {
  var hex = component.toString(16);
  return component < 10 ? '0' + hex : hex;
}


// Public instance methods


/**
 * Set the value of the luminance component.
 * The original value is preserved for out-of-gamut checking.
 * The public value is normalized.
 */
Grayscale.prototype.setY = function(y) {
  this._y = y;
  this.y = Grayscale.normalizeComponent(y);
};


/**
 * Get the normalized (default) or actual value of the red component.
 */
Grayscale.prototype.getY = function(actual) {
  return actual ? this._y : this.y;
};


/**
 * Check the validity of the color
 */
Grayscale.prototype.isOutOfGamut = function() {
  return !Grayscale.validate(this._y);
};


/**
 * Return a string representation of the color's normalized values
 */
Grayscale.prototype.toString = function() {
  return 'grayscale(' + this.y + ')';
};


/**
 * Return a hexadecimal representation of the color's normalized values
 */
Grayscale.prototype.toHex = function() {
  return _componentToHex(this.y);
};


/**
 * TODO - move to palette
 * Return two random RGB colors that are equidistant from the original
 */
Grayscale.prototype.getRandomNeighbors = function() {

  // Determine shorter distance to a bounds
  var yRange = Math.min(Grayscale.MAX_VALUE - this.y, this.y - Grayscale.MIN_VALUE);

  // Get a random integer on either side of the color
  var yRandom = randomInt(-yRange, yRange);

  // Move from current position
  var y1 = this.y + yRandom;

  var random = new this.constructor(y1);

  var y2 = this.y - yRandom;

  var opposite = new this.constructor(y1);

  return [random, opposite];
};


module.exports = Grayscale;