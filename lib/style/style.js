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