
const W = 100;
const H = 100;
var surfaceShader;
var buffer;
let current = new Array(W * H).fill(0);
let previous = new Array(W * H).fill(0);

function preload(){
  // load the shader

  myShader = loadShader('starter.vert', 'starter.frag');
}

function setup() {
  createCanvas(400, 400, WEBGL);
  
  shader(myShader);
  myShader.setUniform('uTexSize', [W, H]);
  buffer = createGraphics(W, H);
  buffer.background(0);
  texture(buffer);
  noStroke();
  noCursor();
}

function draw() {
  let x = floor(random(1, W - 1));
	let y = floor(random(1, H - 1));
	previous[x + y * W] = random(10, 255);

  buffer.loadPixels();
  // for every non-edge element
  for (let y = 1; y < H - 1; y++) {
    const yi = y * W;
    for (let x = 1; x < W - 1; x++) {
      const i = x + yi;
      const val =  (
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
  
  rect(-width/2, -height/2, width, height);
}



