Close Enough
============

Using JavaScript to Emulate the Abstract Expressionist Masterworks of Chuck Close

(Useful docs coming post-vacation.)

In the meanwhile...


```javascript
new CloseEnough.Head(image, {
  canvas: canvas,
  size: 20,
  maquette: {
    angle: 45,
    scale: 1 / 20,
  },
  style: new style.Blobs({
    depth: 5,
    palette: new palette.Lab()
  })
}).render();
```

With jQuery...

```javascript
$('<img>').one('load', function(event) {

  new CloseEnough.Head(this, {
    canvas: $('canvas')[0],
    size: 80,
    maquette: {
      angle: 45,
      scale: 1 / 4
    },
    style: new style.Blobs({
      depth: 3,
      palette: new palette.Lab()
    })
  }).render();
  
})[0].src = '/big-head.png';
```

With video...

```javascript
navigator.getUserMedia = navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia;

var video = document.createElement('video');

$(video).on('canplaythrough', function(event) {
  
  var canvas = document.createElement('canvas');
  var angle = 90

  var then = +new Date();

  function draw() {

    var now = +new Date();

    if (now - then > 64) {

      var head = new CloseEnough.Head(video, {
        canvas: canvas,
        size: 10,
        maquette: {
          angle: angle -= 30,
          scale: 1/16,
        },
        style: new CloseEnough.style.Dots({
          depth: 4,
          palette: new CloseEnough.palette.Lab()
        })
      });

      head.render();
      then = now;
    }

    requestAnimationFrame(draw);
  }

  draw();
  video.play();

  $(canvas).appendTo('body');

});

navigator.getUserMedia({ video: true }, function(stream) {
  video.src = window.URL.createObjectURL(stream);
}, function(error) { console.error(error); });

```
