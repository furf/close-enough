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
