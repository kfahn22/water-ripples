let img;
let pixelation_level = 10;
let W = 100;
function preload() {
  img = loadImage("assets/rocks.jpeg"); 
}

function setup() {
  createCanvas(300, 300);
  pixelDensity(1);
  image(img, 0, 0, width, height);
  loadPixels();
  //print(pixels[0], pixels[1], pixels[2], pixels[3]);
  noStroke();
  
  
  for (let x = 0; x < width; x += pixelation_level) {
    for (let y = 0; y < height; y += pixelation_level) {
      
      let i = (x + y * width) * 4;

      let r = pixels[i + 0];
      let g = pixels[i + 1];
      let b = pixels[i + 2];
      let a = pixels[i + 3];

      fill(r, g, b, a);
      square(x, y, pixelation_level);
    }
  }
}
