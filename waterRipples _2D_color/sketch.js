// Based on Water Ripples Coding Challenge by Daniel Shiffman
// https://thecodingtrain.com/challenges/102-2d-water-ripple

// https://codepen.io/Spongman/project/full/ArxVJQ/, which has a 3D version of water ripples, was also a resource.


const W = 80;
const H = 80;
const dampening = 0.99;

var surfaceShader;
var surfaceTexture;

let current = new Array(W * H).fill(0);
let previous = new Array(W * H).fill(0);

function preload() {
  surfaceShader = loadShader('ripples.frag', 'ripples.vert');
}

function setup() {
  // put setup code here
  createCanvas(800, 800, WEBGL);
  pixelDensity(1);
  
  shader(surfaceShader);
  surfaceShader.setUniform('uTexSize', [W, H]);
  surfaceTexture = createGraphics(W, H);
  surfaceTexture.background(0);
  texture(surfaceTexture);
  noStroke();
}

function mouseDragged() {
}

function draw() {

	let x = floor(random(1, W - 1));
	let y = floor(random(1, H - 1));
	previous[x + y * W] = random(10, 255);
  
	if (mouseIsPressed) {
		const x = floor(map(mouseX, 0, width, 0, W));
		const y = floor(map(mouseY, 0, height, 0, H));
		previous[x + y * W] = 500;		
	}

  surfaceTexture.loadPixels();
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
        constrain(val, 0, 255);
      current[i] = val;
      surfaceTexture.set(x, y, val);
    }
  }

  surfaceTexture.updatePixels();

  let temp = previous;
  previous = current;
  current = temp;

  // put drawing code here
  background(0);
  
  rect(-width/2, -height/2, width, height);
}