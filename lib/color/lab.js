'use strict';


/**
 * Dependencies
 */
var utils = require('../utils');
var clamp = utils.clamp;
var random = utils.random;


// Constructor


/**
 * Create a Lab color
 */
function Lab(l, a, b) {
  this.setL(l);
  this.setA(a);
  this.setB(b);
}


// Public static constants


/**
 * Minimum valid value for a lightness component
 */
Lab.MIN_VALUE_L = 0;


/**
 * Maximum valid value for a lightness component
 */
Lab.MAX_VALUE_L = 100;


/**
 * Median value for a lightness component
 */
Lab.MID_VALUE_L = (Lab.MAX_VALUE_L + Lab.MIN_VALUE_L) / 2;


/**
 * Minimum valid value for an `a` or `b` component
 */
Lab.MIN_VALUE_AB = -128;


/**
 * Maximum valid value for an `a` or `b` component
 */
Lab.MAX_VALUE_AB = 127;


/**
 * Median value for an `a` or `b` component
 */
Lab.MID_VALUE_AB = (Lab.MAX_VALUE_AB + Lab.MIN_VALUE_AB) / 2;


// Public static methods


/**
 * Coerce the value of a lightness component into the valid value range
 */
Lab.normalizeL = function(l) {
  return clamp(l, Lab.MIN_VALUE_L, Lab.MAX_VALUE_L);
};


/**
 * Coerce the value of an `a` or `b` component into the valid value range
 */
Lab.normalizeAB = function(ab) {
  return clamp(ab, Lab.MIN_VALUE_AB, Lab.MAX_VALUE_AB);
};


/**
 * Check the validity of a lightness component value
 */
Lab.validateL = function(l) {
  return l >= Lab.MIN_VALUE_L && l <= Lab.MAX_VALUE_L;
};


/**
 * Check the validity of an `a` or `b` component value
 */
Lab.validateAB = function(ab) {
  return ab >= Lab.MIN_VALUE_AB && ab <= Lab.MAX_VALUE_AB;
};


/**
 * Check the validity of a color
 */
Lab.validate = function(l, a, b) {
  return Lab.validateL(l) && Lab.validateAB(a) && Lab.validateAB(b);
};


/**
 * Return a random lightness component value
 * @returns {Number} random number
 */
Lab.randomValueL = function() {
  return random(Lab.MIN_VALUE_L, Lab.MAX_VALUE_L);
};


/**
 * Return a random `a` or `b` component value
 * @returns {Number} random number
 */
Lab.randomValueAB = function() {
  return random(Lab.MIN_VALUE_AB, Lab.MAX_VALUE_AB);
};


// Public instance methods


/**
 * Set the value of the lightness component.
 * The original value is preserved for out-of-gamut checking.
 * The public value is normalized.
 */
Lab.prototype.setL = function(l) {
  this._l = l;
  this.l = Lab.normalizeL(l);
};


/**
 * Set the value of the `a` component.
 * The original value is preserved for out-of-gamut checking.
 * The public value is normalized.
 */
Lab.prototype.setA = function(a) {
  this._a = a;
  this.a = Lab.normalizeAB(a);
};


/**
 * Set the value of the `b` component.
 * The original value is preserved for out-of-gamut checking.
 * The public value is normalized.
 */
Lab.prototype.setB = function(b) {
  this._b = b;
  this.b = Lab.normalizeAB(b);
};


/**
 * Get the normalized (default) or actual value of the lightness component.
 */
Lab.prototype.getL = function(actual) {
  return actual ? this._l : this.l;
};


/**
 * Get the normalized (default) or actual value of the `a` component.
 */
Lab.prototype.getA = function(actual) {
  return actual ? this._a : this.a;
};


/**
 * Get the normalized (default) or actual value of the `b` component.
 */
Lab.prototype.getB = function(actual) {
  return actual ? this._b : this.b;
};


/**
 * Check the validity of the color
 */
Lab.prototype.isOutOfGamut = function() {
  return !Lab.validate(this._l, this._a, this._b);
};


/**
 * Return a string representation of the color's normalized values
 */
Lab.prototype.toString = function() {
  return 'lab(' + this.l + ',' + this.a + ',' + this.b + ')';
};


module.exports = Lab;