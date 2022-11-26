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
  let pixelation_level = width/W;
  //image(img, 0, 0, width, height);
  img.loadPixels();
  //noStroke();
  // let x = floor(random(1, W - 1));
  // let y = floor(random(1, H - 1));
  //previous[x + y * W] = random(10, 255);
  for (let x = 1; x < img0.pixels.length; x += pixelation_level) {
    for (let y = 1; y < img0.pixels.height; y += pixelation_level) {
      
      let i = (x + y * width) * 4;

      let r = pixels[i + 0];
      let g = pixels[i + 1];
      let b = pixels[i + 2];
      let a = pixels[i + 3];
      // previous[x][y] = pixels[i + 0];
      // previous[x + y * W] = pixels[i + 0];
      

      previous.fill(r, g, b, a);
      
      square(x, y, pixelation_level);
    }
  }
}