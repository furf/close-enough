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
