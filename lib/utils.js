'use strict';

exports.extend = require('extend');

/**
 * Confine a value to a specified range
 * @param {Number} value
 * @param {Number} minimum valid of range
 * @param {Number} maximum value of range
 * @return {Number} clamped value
 */
exports.clamp = function(value, min, max) {
  return value < min ? min : value > max ? max : value;
};


/**
 * Return a random number within a specified range (inclusive)
 * @param {Number} one value
 * @param {Number} another value
 * @return {Number} random value between values
 */
exports.random = function(a, b) {

  var min;
  var max;
  var n;

  if (typeof b === 'undefined') {
    b = a;
    a = 0;
  }

  if (a < b) {
    min = a;
    max = b;
  } else {
    max = a;
    min = b;
  }

  // Calculate a random number. If 0, flip a coin to give 1 a fair(-ish) chance.
  n = Math.random() * (max - min) || exports.randomInt(1);

  return n + min;
};


/**
 * Return a random integer within a specified range (inclusive)
 * @param {Number} one integer
 * @param {Number} another integer
 * @return {Number} random integer between integers
 */
exports.randomInt = function(a, b) {

  var min;
  var max;

  if (typeof b === 'undefined') {
    b = a;
    a = 0;
  }
  if (a < b) {
    min = a;
    max = b;
  } else {
    max = a;
    min = b;
  }
  return Math.floor((Math.random() * (max - min + 1)) + min);
};


var objProto = Object.prototype;

exports.has = function(obj, prop) {
  return objProto.hasOwnProperty.call(obj, prop);
};


exports.inherits = function(Child, Parent, overrides) {

  var prop;

  // Make Child optional
  if (typeof Parent !== 'function') {
    overrides = Parent;
    Parent = Child;
    Child = function() {
      this.constructor.super.apply(this, arguments);
    };
  }

  // Copy static properties
  for (prop in Parent) {
    if (exports.has(Parent, prop)) {
      Child[prop] = Parent[prop];
    }
  }

  Child.super = Parent;
  Child.prototype = Object.create(Parent.prototype, {
    constructor: {
      value: Child,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });

  // Override methods
  if (typeof overrides !== 'undefined') {
    for (prop in overrides) {
      if (exports.has(overrides, prop)) {
        Child.prototype[prop] = overrides[prop];
      }
    }
  }

  return Child;
};

exports.getAreaFromRadius = function(radius) {
  return Math.PI * radius * radius;
};

exports.getRadiusFromArea = function(area) {
  return Math.sqrt(area / Math.PI);
};


exports.sortRandom = function() {
  return 0.5 - Math.random();
};

exports.shuffle = function(arr) {
  return arr.sort(exports.sortRandom);
};

exports.TO_RADIANS = Math.PI / 180;

exports.toRadians = function(degrees) {
  return degrees * exports.TO_RADIANS;
};
