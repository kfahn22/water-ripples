// Based on Water Ripples Coding Challenge by Daniel Shiffman
// https://thecodingtrain.com/challenges/102-2d-water-ripple


// https://codepen.io/Spongman/project/full/ArxVJQ/, which has a 3D version of water ripples, was also a resource.


const W = 400;
const H = 400;
const dampening = 0.995;

var surfaceShader;
var surfaceTexture;

let current = new Array(W * H).fill(0);
let previous = new Array(W * H).fill(0);

let img;

function preload() {
  surfaceShader = loadShader('ripples.frag', 'ripples.vert');
  img = loadImage('assets/rocks.jpeg');
}

function imageIndex(img, x, y) {
  return 4 * (x + y * img.width);
}

function setup() {
  // put setup code here
  createCanvas(400, 400, WEBGL);
  //pixelDensity(1);
  setAttributes('perPixelLighting', true);
  shader(surfaceShader);
  surfaceShader.setUniform('uTexSize', [W, H]);
  surfaceShader.setUniform("u_resolution", [width, height]);
  surfaceShader.setUniform("u_tex0", img);
  buffer = createGraphics(W, H);
  // surfaceTexture.background(0);
  normalMaterial();
  buffer.background(0);
  texture(buffer);
  noCursor();
  noStroke();
}

function draw() {
  //let d = pixelDensity();
  let x = floor(random(1, W - 1));
  let y = floor(random(1, H - 1));
  // for (let i = 1; i < d; i++) {
  //   for (let j = 1; j < d; j++) {
      // loop over
      //previous[i + j * W] = img.get(i, j);
      //previous[x + y * W] = get(x, y);
     previous[x + y * W] = random(10, 255);
  //   }
  // }

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
  pointLight(100, 255, 255);
  rect(-width / 2, -height / 2, width, height);
}