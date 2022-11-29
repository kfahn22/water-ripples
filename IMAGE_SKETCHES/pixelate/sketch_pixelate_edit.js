let img;
const W = 100;
const H = 100;
let previous = new Array(W * H);

function preload() {
  img = loadImage("assets/rocks.jpeg"); 
}

function setup() {
  createCanvas(400, 400);
  pixelDensity(1);
  let pixLevel = width/W;
  img.loadPixels();
  for (let x = 1; x < img.pixels.length; x += pixLevel) {
    for (let y = 1; y < img .pixels.height; y += pixLevel) {
      
      let i = (x + y * width) * 4;

      let r = pixels[i + 0];
      let g = pixels[i + 1];
      let b = pixels[i + 2];
      let a = pixels[i + 3];
      let c = color(r,g,b);
      
      previous[x + y * W] = c;
      

     
    }
  }
}