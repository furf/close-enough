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