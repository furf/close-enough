(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{"../utils":28}],2:[function(require,module,exports){
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
},{"../utils":28}],3:[function(require,module,exports){
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
},{"../utils":28}],4:[function(require,module,exports){
/**
 * None
 */
module.exports = {
  direct: [
    [1.0, 0.0, 0.0],
    [0.0, 1.0, 0.0],
    [0.0, 0.0, 1.0]
  ]
};
},{}],5:[function(require,module,exports){
module.exports=require(1)
},{"../utils":28}],6:[function(require,module,exports){
exports.RGBModel = require('./rgb-model');
exports.RGB = require('./rgb');
exports.Lab = require('./lab');

},{"./lab":7,"./rgb":11,"./rgb-model":10}],7:[function(require,module,exports){
module.exports=require(2)
},{"../utils":28}],8:[function(require,module,exports){
var D65 = require('../reference-white/d65');

/**
 * sRGB
 */
module.exports = {
  rx: 0.64,
  ry: 0.33,
  gx: 0.3,
  gy: 0.6,
  bx: 0.15,
  by: 0.06,
  gamma: -2.2,
  referenceWhite: D65
};

},{"../reference-white/d65":9}],9:[function(require,module,exports){
/**
 * D65 (ASTM E308-01)
 */
module.exports = {
  x: 0.95047,
  y: 1,
  z: 1.08883
};

},{}],10:[function(require,module,exports){
'use strict';


// Dependencies
var sRGB = require('./model/srgb');
var none = require('./adaptation/none');
var utils = require('../utils');

// Shortcuts
var extend = utils.extend;



/**
 *
 */
var kE = 216 / 24389;


/**
 *
 */
var kK = 24389 / 27;


/**
 *
 */
var kKE = 8;

/**
 *
 */
function RGBModel(options) {

  // Configure instance
  this.config = extend(true, {}, RGBModel.defaults, options);

  var model = this.config.model;
  var adaptation = this.config.adaptation;
  var referenceWhite = this.config.referenceWhite || model.referenceWhite;

  var rx = model.rx;
  var ry = model.ry;
  var gx = model.gx;
  var gy = model.gy;
  var bx = model.bx;
  var by = model.by;
  var gamma = model.gamma;
  var white = model.referenceWhite;

  var matrix = [
    [
      rx / ry,
      gx / gy,
      bx / by
    ],
    [
      1,
      1,
      1
    ],
    [
      (1 - rx - ry) / ry,
      (1 - gx - gy) / gy,
      (1 - bx - by) / by
    ]
  ];

  var inverted = RGBModel.invertMatrix(matrix);

  var sr = white.x * inverted[0][0] + white.y * inverted[0][1] + white.z * inverted[0][2];
  var sg = white.x * inverted[1][0] + white.y * inverted[1][1] + white.z * inverted[1][2];
  var sb = white.x * inverted[2][0] + white.y * inverted[2][1] + white.z * inverted[2][2];

  this.model = model;
  this.adaptation = adaptation;
  this.referenceWhite = referenceWhite;

  this.matrixRGBToXYZ = RGBModel.transposeMatrix([
    [
      sr * matrix[0][0],
      sg * matrix[0][1],
      sb * matrix[0][2]
    ],
    [
      sr * matrix[1][0],
      sg * matrix[1][1],
      sb * matrix[1][2]
    ],
    [
      sr * matrix[2][0],
      sg * matrix[2][1],
      sb * matrix[2][2]
    ]
  ]);

  this.matrixXYZToRGB = RGBModel.invertMatrix(this.matrixRGBToXYZ);

  if (gamma > 0) {
    this.compand = this._compandPositiveGamma;
    this.inverseCompand = this._inverseCompandPositiveGamma;
  } else if (gamma < 0) {
    this.compand = this._compandNegativeGamma;
    this.inverseCompand = this._inverseCompandNegativeGamma;
  } else {
    this.compand = this._compandZeroGamma;
    this.inverseCompand = this._inverseCompandZeroGamma;
  }
}


RGBModel.defaults = {
  model: sRGB,
  adaptation: none
};



/**
 *
 */
RGBModel.invertMatrix = function(matrix) {

  var dr = matrix[2][2] * matrix[1][1] - matrix[2][1] * matrix[1][2];
  var dg = matrix[2][2] * matrix[0][1] - matrix[2][1] * matrix[0][2];
  var db = matrix[1][2] * matrix[0][1] - matrix[1][1] * matrix[0][2];

  var determinant = matrix[0][0] * dr - matrix[1][0] * dg + matrix[2][0] * db;

  var scale = 1 / determinant;

  var inverted = [
    [
      scale * dr,
      -scale * dg,
      scale * db
    ],
    [
      -scale * (matrix[2][2] * matrix[1][0] - matrix[2][0] * matrix[1][2]),
      scale * (matrix[2][2] * matrix[0][0] - matrix[2][0] * matrix[0][2]),
      -scale * (matrix[1][2] * matrix[0][0] - matrix[1][0] * matrix[0][2])
    ],
    [
      scale * (matrix[2][1] * matrix[1][0] - matrix[2][0] * matrix[1][1]),
      -scale * (matrix[2][1] * matrix[0][0] - matrix[2][0] * matrix[0][1]),
      scale * (matrix[1][1] * matrix[0][0] - matrix[1][0] * matrix[0][1])
    ]
  ];

  return inverted;
};


/**
 *
 */
RGBModel.transposeMatrix = function(matrix) {

  var transposed = [
    [matrix[0][0], matrix[1][0], matrix[2][0]],
    [matrix[0][1], matrix[1][1], matrix[2][1]],
    [matrix[0][2], matrix[1][2], matrix[2][2]]
  ];

  return transposed;
};


/**
 *
 */
RGBModel.prototype._compandPositiveGamma = function(linear) {

  var gamma = this.model.gamma;
  var companded = (linear >= 0) ? Math.pow(linear, 1 / gamma) : -Math.pow(-linear, 1 / gamma);

  return companded;
};


/**
 *
 */
RGBModel.prototype._compandNegativeGamma = function(linear) {

  var companded;
  var gamma = this.model.gamma;
  var sign = 1;

  if (linear < 0) {
    sign = -1;
    linear = -linear;
  }

  companded = (linear <= 0.0031308) ? (linear * 12.92) : (1.055 * Math.pow(linear, 1 / 2.4) - 0.055);
  companded *= sign;

  return companded;
};


/**
 *
 */
RGBModel.prototype._compandZeroGamma = function(linear) {

  var companded;
  var gamma = this.model.gamma;
  var sign = 1;

  if (linear < 0) {
    sign = -1;
    linear = -linear;
  }

  companded = (linear <= (216 / 24389)) ? (linear * 24389 / 2700) : (1.16 * Math.pow(linear, 1 / 3) - 0.16);
  companded *= sign;

  return companded;
};


/**
 *
 */
RGBModel.prototype._inverseCompandPositiveGamma = function(companded) {

  var linear;
  var gamma = this.model.gamma;

  linear = (companded >= 0) ? Math.pow(companded, gamma) : -Math.pow(-companded, gamma);

  return linear;
};


/**
 *
 */
RGBModel.prototype._inverseCompandNegativeGamma = function(companded) {

  var linear;
  var gamma = this.model.gamma;
  var sign = 1;

  if (companded < 0) {
    sign = -1;
    companded = -companded;
  }

  linear = (companded <= 0.04045) ? (companded / 12.92) : Math.pow((companded + 0.055) / 1.055, 2.4);
  linear *= sign;

  return linear;
};


/**
 *
 */
RGBModel.prototype._inverseCompandZeroGamma = function(companded) {

  var linear;
  var gamma = this.model.gamma;
  var sign = 1;

  if (companded < 0) {
    sign = -1;
    companded = -companded;
  }

  linear = (companded <= 0.08) ? (2700 * companded / 24389) : ((((1000000 * companded + 480000) * companded + 76800) * companded + 4096) / 1560896);
  linear *= sign;

  return linear;
};


/**
 *
 */
RGBModel.prototype.convertRGBToXYZ = function(r, g, b) {

  var xyz = {};

  var matrixRGBToXYZ = this.matrixRGBToXYZ;
  var direct = this.adaptation.direct;
  var inverse = this.adaptation.inverse;
  var white1 = this.referenceWhite;
  var white2 = this.model.referenceWhite;
  var ad;
  var bd;
  var cd;
  var as;
  var bs;
  var cs;
  var x;
  var y;
  var z;

  r = this.inverseCompand(r / 255);
  g = this.inverseCompand(g / 255);
  b = this.inverseCompand(b / 255);

  xyz.x = r * matrixRGBToXYZ[0][0] + g * matrixRGBToXYZ[1][0] + b * matrixRGBToXYZ[2][0];
  xyz.y = r * matrixRGBToXYZ[0][1] + g * matrixRGBToXYZ[1][1] + b * matrixRGBToXYZ[2][1];
  xyz.z = r * matrixRGBToXYZ[0][2] + g * matrixRGBToXYZ[1][2] + b * matrixRGBToXYZ[2][2];

  if (inverse && white1 !== white2) {

    ad = white1.x * direct[0][0] + white1.y * direct[1][0] + white1.z * direct[2][0];
    bd = white1.x * direct[0][1] + white1.y * direct[1][1] + white1.z * direct[2][1];
    cd = white1.x * direct[0][2] + white1.y * direct[1][2] + white1.z * direct[2][2];

    as = white2.x * direct[0][0] + white2.y * direct[1][0] + white2.z * direct[2][0];
    bs = white2.x * direct[0][1] + white2.y * direct[1][1] + white2.z * direct[2][1];
    cs = white2.x * direct[0][2] + white2.y * direct[1][2] + white2.z * direct[2][2];

    x = xyz.x * direct[0][0] + xyz.y * direct[1][0] + xyz.z * direct[2][0];
    y = xyz.x * direct[0][1] + xyz.y * direct[1][1] + xyz.z * direct[2][1];
    z = xyz.x * direct[0][2] + xyz.y * direct[1][2] + xyz.z * direct[2][2];

    x *= (ad / as);
    y *= (bd / bs);
    z *= (cd / cs);

    xyz.x = x * inverse[0][0] + y * inverse[1][0] + z * inverse[2][0];
    xyz.y = x * inverse[0][1] + y * inverse[1][1] + z * inverse[2][1];
    xyz.z = x * inverse[0][2] + y * inverse[1][2] + z * inverse[2][2];
  }

  return xyz;
};


/**
 *
 */
RGBModel.prototype.convertXYZToLab = function(x, y, z) {

  var lab = {};
  var white = this.referenceWhite;

  var xr = x / white.x;
  var yr = y / white.y;
  var zr = z / white.z;

  var fx = (xr > kE) ? Math.pow(xr, 1 / 3) : ((kK * xr + 16) / 116);
  var fy = (yr > kE) ? Math.pow(yr, 1 / 3) : ((kK * yr + 16) / 116);
  var fz = (zr > kE) ? Math.pow(zr, 1 / 3) : ((kK * zr + 16) / 116);

  lab.l = 116 * fy - 16;
  lab.a = 500 * (fx - fy);
  lab.b = 200 * (fy - fz);

  return lab;
};


/**
 *
 */
RGBModel.prototype.convertLabToXYZ = function(l, a, b) {

  var xyz = {};

  var white = this.referenceWhite;

  var fy = (l + 16) / 116;
  var fx = 0.002 * a + fy;
  var fz = fy - 0.005 * b;

  var fx3 = fx * fx * fx;
  var fz3 = fz * fz * fz;

  var xr = (fx3 > kE) ? fx3 : ((116 * fx - 16) / kK);
  var yr = (l > kKE) ? Math.pow((l + 16) / 116, 3) : (l / kK);
  var zr = (fz3 > kE) ? fz3 : ((116 * fz - 16) / kK);

  xyz.x = xr * white.x;
  xyz.y = yr * white.y;
  xyz.z = zr * white.z;

  return xyz;
};


/**
 *
 */
RGBModel.prototype.convertXYZToRGB = function(x, y, z) {

  var rgb = {};

  var matrixXYZToRGB = this.matrixXYZToRGB;
  var direct = this.adaptation.direct;
  var inverse = this.adaptation.inverse;
  var white1 = this.referenceWhite;
  var white2 = this.model.referenceWhite;

  var x2 = x;
  var y2 = y;
  var z2 = z;
  var as;
  var bs;
  var cs;
  var ad;
  var bd;
  var cd;
  var x1;
  var y1;
  var z1;
  var r;
  var g;
  var b;

  if (inverse && white1 !== white2) {

    as = white1.x * direct[0][0] + white1.y * direct[1][0] + white1.z * direct[2][0];
    bs = white1.x * direct[0][1] + white1.y * direct[1][1] + white1.z * direct[2][1];
    cs = white1.x * direct[0][2] + white1.y * direct[1][2] + white1.z * direct[2][2];

    ad = white2.x * direct[0][0] + white2.y * direct[1][0] + white2.z * direct[2][0];
    bd = white2.x * direct[0][1] + white2.y * direct[1][1] + white2.z * direct[2][1];
    cd = white2.x * direct[0][2] + white2.y * direct[1][2] + white2.z * direct[2][2];

    x1 = x * direct[0][0] + y * direct[1][0] + z * direct[2][0];
    y1 = x * direct[0][1] + y * direct[1][1] + z * direct[2][1];
    z1 = x * direct[0][2] + y * direct[1][2] + z * direct[2][2];

    x1 *= (ad / as);
    y1 *= (bd / bs);
    z1 *= (cd / cs);

    x2 = x1 * inverse[0][0] + y1 * inverse[1][0] + z1 * inverse[2][0];
    y2 = x1 * inverse[0][1] + y1 * inverse[1][1] + z1 * inverse[2][1];
    z2 = x1 * inverse[0][2] + y1 * inverse[1][2] + z1 * inverse[2][2];
  }

  r = this.compand(x2 * matrixXYZToRGB[0][0] + y2 * matrixXYZToRGB[1][0] + z2 * matrixXYZToRGB[2][0]);
  g = this.compand(x2 * matrixXYZToRGB[0][1] + y2 * matrixXYZToRGB[1][1] + z2 * matrixXYZToRGB[2][1]);
  b = this.compand(x2 * matrixXYZToRGB[0][2] + y2 * matrixXYZToRGB[1][2] + z2 * matrixXYZToRGB[2][2]);

  rgb.r = Math.abs(r * 255);
  rgb.g = Math.abs(g * 255);
  rgb.b = Math.abs(b * 255);

  return rgb;
};


/**
 * Shortcut method to convert colors from RGB to Lab (via XYZ)
 */
RGBModel.prototype.convertRGBToLab = function(r, g, b) {
  var xyz = this.convertRGBToXYZ(r, g, b);
  return this.convertXYZToLab(xyz.x, xyz.y, xyz.z);
};


/**
 * Shortcut method to convert colors from Lab to RGB (via XYZ)
 */
RGBModel.prototype.convertLabToRGB = function(l, a, b) {
  var xyz = this.convertLabToXYZ(l, a, b);
  return this.convertXYZToRGB(xyz.x, xyz.y, xyz.z);
};


/**
 * Shortcut method to convert colors from RGB to grayscale (preserving luminance)
 */
RGBModel.prototype.convertRGBToGrayscale = function(r, g, b) {
  var grayscale = {};
  grayscale.y = r * 0.2126 + g * 0.7152 + b * 0.0722;
  return grayscale;
};


module.exports = RGBModel;

},{"../utils":28,"./adaptation/none":4,"./model/srgb":8}],11:[function(require,module,exports){
module.exports=require(3)
},{"../utils":28}],12:[function(require,module,exports){
'use strict';


// Dependencies
var utils = require('./utils');
var Maquette = require('./maquette');
var Style = require('./style').Style;
var Palette = require('./palette');


// Shortcuts
var extend = utils.extend;
var toRadians = utils.toRadians;


/**
 *
 */
function Head(source, options) {

  // Configure instance
  this.config = extend(true, {}, Head.defaults, options);

  if (this.config.maquette instanceof Maquette) {
    this.maquette = this.config.maquette;
  } else {
    this.maquette = new Maquette(source, this.config.maquette);
  }

  if (this.config.style instanceof Style) {
    this.style = this.config.style;
  } else {
    this.style = new Style(this.config.style);
  }

  this.width = this.maquette.scaledWidth * this.config.size;
  this.height = this.maquette.scaledHeight * this.config.size;

  this.canvas = this.config.canvas || document.createElement('canvas');
  this.context = this.canvas.getContext('2d');
}


/**
 *
 */
Head.defaults = {
  size: 10,
  maquette: {
    angle: 0,
    background: 'rgba(0, 0, 0, 0)',
    scale: 0.1,
  },
  style: {}
};


/**
 *
 */
Head.prototype.render = function() {

  var maquette = this.maquette;
  var palette = this.palette;
  var style = this.style;
  var context = this.context;

  var w = maquette.width;
  var h = maquette.height;
  var y;
  var x;
  var offsetY;
  var offsetX;
  var i = 0;
  var size = this.config.size;
  var rgba = maquette.getImageData().data;
  var rgb;


  // Reset canvas
  this.canvas.width = this.width;
  this.canvas.height = this.height;

  if (maquette.angle) {
    context.rotate(toRadians(-maquette.angle));
    context.translate(-maquette.offsetX * size, -maquette.offsetY * size);
  }

  for (y = 0; y < h; ++y) {
    offsetY = y * size;
    for (x = 0; x < w; ++x) {
      offsetX = x * size;

      // Paint!
      style.apply(context, offsetX, offsetY, size, size, rgba[i++], rgba[i++], rgba[i++]);

      // Pour some out for our alpha dogs
      i++;

    }
  }
};


/**
 *
 */
Head.prototype.getImage = function() {
  this.render();
  return this.canvas;
};


/**
 *
 */
Head.prototype.getImageData = function() {
  this.render();
  return this.context.getImageData(0, 0, this.width, this.height);
};

module.exports = Head;
},{"./maquette":14,"./palette":16,"./style":24,"./utils":28}],13:[function(require,module,exports){
'use strict';

window.CloseEnough = {
  color: require('./color'),
  Head: require('./head'),
  Maquette: require('./maquette'),
  palette: require('./palette'),
  style: require('./style'),
  utils: require('./utils')
};

},{"./color":6,"./head":12,"./maquette":14,"./palette":16,"./style":24,"./utils":28}],14:[function(require,module,exports){
'use strict';


// Dependencies
var utils = require('./utils');


// Shortcuts
var extend = utils.extend;
var toRadians = utils.toRadians;

/**
 * @param {HTMLImageElement|HTMLVideoElement|HTMLCanvasElement} source
 * @param {Number} scale
 */
function Maquette(source, options) {

  switch (source.nodeName) {
    case 'IMG':
      this.sourceWidth = source.naturalWidth;
      this.sourceHeight = source.naturalHeight;
    break;
    case 'VIDEO':
      this.sourceWidth = source.videoWidth;
      this.sourceHeight = source.videoHeight;
    break;
    case 'CANVAS':
      this.sourceWidth = source.width;
      this.sourceHeight = source.height;
    break;
    default:
      throw new Error('Invalid source type.');
  }

  this.source = source;

  // Configure instance
  this.config = extend(true, {}, Maquette.defaults, options);

  this.canvas = document.createElement('canvas');
  this.context = this.canvas.getContext('2d');

  this.context.webkitImageSmoothingEnabled = false;
  this.context.mozImageSmoothingEnabled = false;
  this.context.imageSmoothingEnabled = false;

  this._canvas = document.createElement('canvas');
  this._context = this._canvas.getContext('2d');

  this._context.webkitImageSmoothingEnabled = false;
  this._context.mozImageSmoothingEnabled = false;
  this._context.imageSmoothingEnabled = false;

  this.calculateDimensions();
}

Maquette.defaults = {
  angle: 0,
  background: 'rgba(0, 0, 0, 0)',
  scale: 1
};

Maquette.normalizeAngle = function(angle) {
  return (360 + (angle % 360)) % 360;
};

Maquette.prototype.calculateDimensions = function() {

  var angle = Maquette.normalizeAngle(this.config.angle);
  var scaledWidth = this.sourceWidth * this.config.scale;
  var scaledHeight = this.sourceHeight * this.config.scale;
  var inverseTheta;
  var offsetL;
  var offsetR;
  var offsetT;
  var offsetB;
  var offsetX;
  var offsetY;
  var width;
  var height;

  this.scaledWidth = scaledWidth;
  this.scaledHeight = scaledHeight;
  this.angle = angle;
  
  if (angle) {

    this.theta = toRadians(angle);

    offsetR = Math.abs(Math.cos(this.theta) * scaledWidth);
    offsetB = Math.abs(Math.sin(this.theta) * scaledWidth);

    inverseTheta = toRadians(90 - angle);

    offsetL = Math.abs(Math.cos(inverseTheta) * scaledHeight);
    offsetT = Math.abs(Math.sin(inverseTheta) * scaledHeight);

    width = Math.ceil(offsetL + offsetR);
    height = Math.ceil(offsetT + offsetB);

    if (angle < 90) {
      this.offsetX = offsetL;
      this.offsetY = 0;
    } else if (angle < 180) {
      this.offsetX = width;
      this.offsetY = offsetT;
    } else if (angle < 270) {
      this.offsetX = offsetR;
      this.offsetY = height;
    } else if (angle < 360) {
      this.offsetX = 0;
      this.offsetY = offsetB;
    }

    this.width = width;
    this.height = height;
    this.offsetT = offsetT;
    this.offsetR = offsetR;
    this.offsetB = offsetB;
    this.offsetL = offsetL;


  } else {
    this.width = scaledWidth;
    this.height = scaledHeight;
    this.offsetX = 0;
    this.offsetY = 0;
  }
};

Maquette.prototype.render = function() {

  var width = this.width;
  var height = this.height;
  var source;
  var context;

  if (this.theta) {

    source = this._canvas;
    context = this._context;

    // Size source
    source.width = width;
    source.height = height;

    // Fill background
    context.fillStyle = this.config.background;
    context.fillRect(0, 0, width, height);

    // Position context to center rotated image
    context.translate(this.offsetX, this.offsetY);
    context.rotate(this.theta);
    context.scale(this.config.scale, this.config.scale);
    context.drawImage(this.source, 0, 0);
    context.restore();

  } else {
    source = this.source;
  }

  this.canvas.width = width;
  this.canvas.height = height;

  this.context.drawImage(source, 0, 0, width, height);
};


Maquette.prototype.getImage = function() {
  this.render();
  return this.canvas;
};


Maquette.prototype.getImageData = function() {
  this.render();
  return this.context.getImageData(0, 0, this.width, this.height);
};

module.exports = Maquette;

},{"./utils":28}],15:[function(require,module,exports){
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
},{"../color/grayscale":5,"../utils":28,"./palette":18}],16:[function(require,module,exports){
exports.Palette = require('./palette');
exports.RGB = require('./rgb');
exports.Lab = require('./lab');
exports.Grayscale = require('./grayscale');

},{"./grayscale":15,"./lab":17,"./palette":18,"./rgb":19}],17:[function(require,module,exports){
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
},{"../color/lab":7,"../utils":28,"./palette":18}],18:[function(require,module,exports){
'use strict';

var utils = require('../utils');
var RGBModel = require('../color/rgb-model');
var RGB = require('../color/RGB');
var Lab = require('../color/Lab');
var Grayscale = require('../color/Grayscale');

var extend = utils.extend;
var inherits = utils.inherits;

/**
 *
 */
function Palette(options) {

  var rgbModel;
  var CustomRGB;
  var CustomLab;
  var CustomGrayscale;

  // Configure instance
  this.config = utils.extend(true, {}, this.constructor.defaults, options);

  if (this.config.rgbModel instanceof RGBModel) {
    rgbModel = this.config.rgbModel;
  } else {
    rgbModel = new RGBModel(this.config.rgbModel);
  }

  CustomRGB = inherits(RGB, {
    
    toRGB: function() {
      return this;
    },

    toLab: function() {
      var lab = rgbModel.convertRGBToLab(this.r, this.g, this.b);
      return new CustomLab(lab.l, lab.a, lab.b);
    },

    toGrayscale: function() {
      var grayscale = rgbModel.convertRGBToGrayscale(this.r, this.g, this.b);
      return new CustomGrayscale(grayscale.y);
    }
  });

  this.RGB = CustomRGB;

  CustomLab = inherits(Lab, {

    toRGB: function() {
      var rgb = rgbModel.convertLabToRGB(this.l, this.a, this.b);
      return new CustomRGB(rgb.r, rgb.g, rgb.b);
    },

    toLab: function() {
      return this;
    },

    toGrayscale: function() {
      return this.toRGB().toGrayscale();
    }
  });

  this.Lab = CustomLab;

  CustomGrayscale = inherits(Grayscale, {

    toRGB: function() {
      return new CustomRGB(this.y, this.y, this.y);
    },

    toLab: function() {
      return this.toRGB().toLab();
    },

    toGrayscale: function() {
      return this;
    }
  });

  this.Grayscale = CustomGrayscale;
}


/**
 *
 */
Palette.defaults = {
  rgbModel: {}
};


/**
 *
 */
Palette.prototype.create = function() {
  throw new Error('Palette.prototype.create is an abstract method.');
};


/**
 *
 */
Palette.prototype.createFromRGB = function() {
  throw new Error('Palette.prototype.createFromRGB is an abstract method.');
};


module.exports = Palette;
},{"../color/Grayscale":1,"../color/Lab":2,"../color/RGB":3,"../color/rgb-model":10,"../utils":28}],19:[function(require,module,exports){
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
},{"../color/RGB":3,"../utils":28,"./palette":18}],20:[function(require,module,exports){
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

},{"../palette":16,"../utils":28,"./style":26}],21:[function(require,module,exports){
'use strict';

var Style = require('./style');
var Palette = require('../palette').Palette;
var utils = require('../utils');
var extend = utils.extend;


/**
 *
 */
function Diamond(options) {

  this.config = extend(true, {}, Diamond.defaults, options);

  if (this.config.palette instanceof Palette) {
    this.palette = this.config.palette;
  } else {
    this.palette = new Palette(this.config.palette);
  }
}

utils.inherits(Diamond, Style);


/**
 *
 */
Diamond.defaults = {
  scale: 1,
  palette: {}
};


/**
 *
 */
Diamond.prototype.paintRectangle = function(context, x, y, width, height, color) {

  var scale = this.config.scale;

  var scaledWidth = width * scale;
  var scaledHeight = height * scale;
  
  var diffWidth = scaledWidth - width;
  var diffHeight = scaledHeight - height;
  
  var offsetX = diffWidth / 2;
  var offsetY = diffHeight / 2;

  var left = x - offsetX;
  var top = y - offsetY;
  
  var right = left + scaledWidth;
  var bottom = top + scaledHeight;
  
  var midX = left + scaledWidth / 2;
  var midY = top + scaledHeight / 2;

  context.beginPath();
  context.lineTo(midX, top);
  context.lineTo(right, midY);
  context.lineTo(midX, bottom);  
  context.lineTo(left, midY);  
  context.lineTo(midX, top);
  context.closePath();

  context.fillStyle = color.toString();
  context.fill();
};


/**
 *
 */
Diamond.prototype.apply = function(context, x, y, width, height, r, g, b) {


  var palette = this.palette;
  var color = palette.createFromRGB(r, g, b);

  // shuffle(colors);

  this.paintRectangle(context, x, y, width, height, color.toRGB());
};


module.exports = Diamond;
},{"../palette":16,"../utils":28,"./style":26}],22:[function(require,module,exports){
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
  var colors = [];
  var depth = this.config.depth;
  var i;
  var n;
  var midX = x + width / 2;
  var midY = y + height / 2;
  var area = width * height;
  var radius;

  // var toggle = 1;

  // function sortByLuminance(a, b) {
  //   toggle = toggle === 1 ? -1 : 1;
  //   return a.l - b.l * toggle;
  // }

  for (i = 1; i < depth; ++i) {
    colors.push.apply(colors, palette.getRandomNeighbors(color));
  }

  this.paintRectangle(context, x, y, width, height, colors[0].toRGB());

  for (i = 1, n = colors.length; i < n; ++i) {
    area /= 2;
    radius = getRadiusFromArea(area);
    this.paintCircle(context, midX, midY, radius, colors[i].toRGB());
  }
};


module.exports = Dots;
},{"../palette":16,"../utils":28,"./style":26}],23:[function(require,module,exports){
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
},{"../palette":16,"../utils":28,"./style":26}],24:[function(require,module,exports){
exports.Style = require('./style');
exports.Dots = require('./dots');
exports.Mosaic = require('./mosaic');
exports.Diamond = require('./diamond');
exports.DotsRedux = require('./dots-redux');
exports.Blobs = require('./blobs');
exports.Triangle = require('./triangle');

},{"./blobs":20,"./diamond":21,"./dots":23,"./dots-redux":22,"./mosaic":25,"./style":26,"./triangle":27}],25:[function(require,module,exports){
'use strict';

var Style = require('./style');
var Palette = require('../palette').Palette;
var utils = require('../utils');
var extend = utils.extend;


/**
 *
 */
function Mosaic(options) {

  this.config = extend(true, {}, Mosaic.defaults, options);

  if (this.config.palette instanceof Palette) {
    this.palette = this.config.palette;
  } else {
    this.palette = new Palette(this.config.palette);
  }
}

utils.inherits(Mosaic, Style);


/**
 *
 */
Mosaic.defaults = {
  palette: {}
};


/**
 *
 */
Mosaic.prototype.paintRectangle = function(context, x, y, width, height, color) {
  context.fillStyle = color.toString();
  context.fillRect(x, y, width, height);
};


/**
 *
 */
Mosaic.prototype.apply = function(context, x, y, width, height, r, g, b) {


  var palette = this.palette;
  var color = palette.createFromRGB(r, g, b);

  // shuffle(colors);

  this.paintRectangle(context, x, y, width, height, color.toRGB());
};


module.exports = Mosaic;
},{"../palette":16,"../utils":28,"./style":26}],26:[function(require,module,exports){
'use strict';

var utils = require('../utils');
var Palette = require('../palette').Palette;

var extend = utils.extend;


/**
 *
 */
function Style(options) {

  this.config = extend(true, {}, Style.defaults, options);

  if (this.config.palette instanceof Palette) {
    this.palette = this.config.palette;
  } else {
    this.palette = new Palette(this.config.palette);
  }
}


/**
 *
 */
Style.defaults = {
  palette: {}
};


/**
 *
 */
Style.prototype.apply = function(context, x, y, width, height, r, g, b) {
  throw new Error('Style.prototype.apply is an abstract method');
};


module.exports = Style;
},{"../palette":16,"../utils":28}],27:[function(require,module,exports){
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
},{"../palette":16,"../utils":28,"./style":26}],28:[function(require,module,exports){
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

},{"extend":29}],29:[function(require,module,exports){
var hasOwn = Object.prototype.hasOwnProperty;
var toString = Object.prototype.toString;

function isPlainObject(obj) {
	if (!obj || toString.call(obj) !== '[object Object]' || obj.nodeType || obj.setInterval)
		return false;

	var has_own_constructor = hasOwn.call(obj, 'constructor');
	var has_is_property_of_method = hasOwn.call(obj.constructor.prototype, 'isPrototypeOf');
	// Not own constructor property must be Object
	if (obj.constructor && !has_own_constructor && !has_is_property_of_method)
		return false;

	// Own properties are enumerated firstly, so to speed up,
	// if last one is own, then all properties are own.
	var key;
	for ( key in obj ) {}

	return key === undefined || hasOwn.call( obj, key );
};

module.exports = function extend() {
	var options, name, src, copy, copyIsArray, clone,
	    target = arguments[0] || {},
	    i = 1,
	    length = arguments.length,
	    deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && typeof target !== "function") {
		target = {};
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( isPlainObject(copy) || (copyIsArray = Array.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && Array.isArray(src) ? src : [];

					} else {
						clone = src && isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

},{}]},{},[13]);