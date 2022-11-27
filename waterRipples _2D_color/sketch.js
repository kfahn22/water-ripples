// Based on Water Ripples Coding Challenge by Daniel Shiffman
// https://thecodingtrain.com/challenges/102-2d-water-ripple


// https://codepen.io/Spongman/project/full/ArxVJQ/, which has a 3D version of water ripples, was also a resource.


const W = 600;
const H = 600;
const dampening = 0.995;

var rippleShader;
var buffer;
let img;

let current = new Array(W * H).fill(0);
let previous = new Array(W * H).fill(0);

function preload() {
  rippleShader = loadShader('ripples.frag', 'ripples.vert');
  img = loadImage('assets/rocks.jpeg');
}

// function imageIndex(img, x, y) {
//   return 4 * (x + y * img.width);
// }

function setup() {
  // put setup code here
  createCanvas(600, 600, WEBGL);
  //pixelDensity(1);
  setAttributes('perPixelLighting', true);

  shader(rippleShader);
  rippleShader.setUniform('uTexSize', [W, H]);
  buffer = createGraphics(W, H);
  //ambientMaterial(0,255,255);
  buffer.background(0);
  texture(buffer);
  noCursor();
  noStroke();
}

function draw() {
  rippleShader.setUniform("u_tex0", img);
  rippleShader.setUniform("u_resolution", [width, height]);
  
  let x = floor(random(1, W - 1));
  let y = floor(random(1, H - 1));
  previous[x + y * W] = random(10, 255);

  if (mouseIsPressed) {
    const x = floor(map(mouseX, 0, width, 0, W));
    const y = floor(map(mouseY, 0, height, 0, H));
    previous[x + y * W] = 1000;
  }

  buffer.loadPixels();
  // for every non-edge element
  for (let y = 1; y < H - 1; y++) {
    const yi = y * W;
    for (let x = 1; x < W - 1; x++) {
      const i = x + yi;
      const val = dampening * (
        (
          previous[i - 1] +
          previous[i + 1] +
          previous[i - W] +
          previous[i + W]
        ) / 2 -
        current[i]);
      current[i] = val;
      buffer.set(x, y, val);
    }
  }

  buffer.updatePixels();

  let temp = previous;
  previous = current;
  current = temp;

  // put drawing code here
  background(0);

  // Blue water ripples
  //pointLight(100, 255, 255);
  rect(-width / 2, -height / 2, width, height);
}