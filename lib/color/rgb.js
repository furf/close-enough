'use strict';

/**
 * Dependencies
 */
var utils = require('../utils');
var clamp = utils.clamp;
var randomInt = utils.randomInt;

// Constructor


/**
 * Create an RGB color
 */
function RGB(r, g, b) {
  this.setR(r);
  this.setG(g);
  this.setB(b);
}


// Public static constants


/**
 * Minimum valid value for an RGB component
 */
RGB.MIN_VALUE = 0;


/**
 * Maximum valid value for an RGB component
 */
RGB.MAX_VALUE = 255;


/**
 * Median value for an RGB component (used for bounding)
 */
RGB.MID_VALUE = (RGB.MAX_VALUE + RGB.MIN_VALUE) / 2;


// Public static methods


/**
 * Coerce the value of a component into the valid value range
 */
RGB.normalizeComponent = function(component) {
  return clamp(Math.round(component), RGB.MIN_VALUE, RGB.MAX_VALUE);
};


/**
 * Check the validity of a component value
 */
RGB.validateComponent = function(component) {
  return component >= RGB.MIN_VALUE && component <= RGB.MAX_VALUE;
};


/**
 * Check the validity of a color
 */
RGB.validate = function(r, g, b) {
  return RGB.validateComponent(r) && RGB.validateComponent(g) && RGB.validateComponent(b);
};


/**
 * Return a random RGB component value
 * @returns {Number} random integer
 */
RGB.randomValue = function() {
  return randomInt(RGB.MIN_VALUE, RGB.MAX_VALUE);
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
 * Set the value of the red component.
 * The original value is preserved for out-of-gamut checking.
 * The public value is normalized.
 */
RGB.prototype.setR = function(r) {
  this._r = r;
  this.r = RGB.normalizeComponent(r);
};


/**
 * Set the value of the green component.
 * The original value is preserved for out-of-gamut checking.
 * The public value is normalized.
 */
RGB.prototype.setG = function(g) {
  this._g = g;
  this.g = RGB.normalizeComponent(g);
};


/**
 * Set the value of the blue component.
 * The original value is preserved for out-of-gamut checking.
 * The public value is normalized.
 */
RGB.prototype.setB = function(b) {
  this._b = b;
  this.b = RGB.normalizeComponent(b);
};


/**
 * Get the normalized (default) or actual value of the red component.
 */
RGB.prototype.getR = function(actual) {
  return actual ? this._r : this.r;
};


/**
 * Get the normalized (default) or actual value of the green component.
 */
RGB.prototype.getG = function(actual) {
  return actual ? this._g : this.g;
};


/**
 * Get the normalized (default) or actual value of the blue component.
 */
RGB.prototype.getB = function(actual) {
  return actual ? this._b : this.b;
};


/**
 * Check the validity of the color
 */
RGB.prototype.isOutOfGamut = function() {
  return !RGB.validate(this._r, this._g, this._b);
};


/**
 * Return a string representation of the color's normalized values
 */
RGB.prototype.toString = function() {
  return 'rgb(' + this.r + ',' + this.g + ',' + this.b + ')';
};


/**
 * Return a hexadecimal representation of the color's normalized values
 */
RGB.prototype.toHex = function() {
  return _componentToHex(this.r) + _componentToHex(this.g) + _componentToHex(this.b);
};


module.exports = RGB;