let img;
let pixelation_level = 10;
let W = 100;
function preload() {
  img = loadImage("assets/rocks.jpeg"); 
}

function setup() {
  createCanvas(300, 400);
  background(255);
  pixelDensity(1);
  image(img, 0, 0, width, height);
  loadPixels();
  //print(pixels[0], pixels[1], pixels[2], pixels[3]);
  noStroke();
  
  
  for (let x = 1; x < width; x += pixelation_level) {
    for (let y = 1; y < height; y += pixelation_level) {
      
      let i = (x + y * width) * 4;

      let r = pixels[i + 0];
      let g = pixels[i + 1];
      let b = pixels[i + 2];
      let a = pixels[i + 3];
      let wh = 2;
      fill(r, g, b, a);
      square(x+wh, y+wh, pixelation_level-wh);
      fill(255);
      rect(x+pixelation_level, y, wh, pixelation_level);
      rect(x, y+pixelation_level, pixelation_level, wh);
    }
  }
}
