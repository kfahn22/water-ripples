// From https://codepen.io/Spongman/project/full/ArxVJQ/

const W = 40;
const H = 40;
const dampening = 0.9;

var rippleShader;
var rippleTexture;
let img0;
let current = new Array(W * H).fill(0);
let previous = new Array(W * H).fill(0);

function preload() {
  rippleShader = loadShader('starter.vert', 'starter.frag');
}

function setup() {
  // put setup code here
  createCanvas(400, 400, WEBGL);
  pixelDensity(1);
  // img0 = createImage(400, 400);
  // img0.loadPixels();
  // for (let i = 0; i < img0.pixels.length; i += 4) {
  //   let value = 0;
  //   if (random(1) < 0.01) value = 255;
  //   img0.pixels[i + 0] = value;
  //   img0.pixels[i + 1] = value;
  //   img0.pixels[i + 2] = value;
  //   img0.pixels[i + 3] = 255;
  // }
  // img0.updatePixels();
  // buffer = createGraphics(400, 400, WEBGL);
  


  shader(rippleShader);
  rippleShader.setUniform('uTexSize', [W, H]);
  rippleShader.setUniform("u_tex0", img0);
  rippleShader.setUniform("u_resolution", [width, height]);
  //rippleTexture = createGraphics(W, H);
  //img0 = createGraphics(W, H);
  img0 = createImage(W, H);
  //rippleTexture.background(0);
  img0.background(0);
  //texture(rippleTexture);
  texture(img0);
  noStroke();
}


function mouseDragged() {
}

function draw() {

	let x = floor(random(1, W - 1));
	let y = floor(random(1, H - 1));
	previous[x + y * W] = random(10, 255);
	
	//rotateZ(millis()/4000);
	
	if (mouseIsPressed) {
		const x = floor(map(mouseX, 0, width, 0, W));
		const y = floor(map(mouseY, 0, height, 0, H));
		previous[x + y * W] = 255;		
	}

  //rippleTexture.loadPixels();
  img0.loadPixels();

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
      //rippleTexture.set(x, y, val);
      img0.set(x, y, val);
    }
  }
  //rippleTexture.updatePixels();
  img0.updatePixels();

  let temp = previous;
  previous = current;
  current = temp;

  // put drawing code here
  background(0);
  rect(0, 0, W, H);
}
