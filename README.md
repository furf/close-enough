Close Enough
============

Using JavaScript to Emulate the Abstract Expressionist Masterworks of Chuck Close


```
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