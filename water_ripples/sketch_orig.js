const W = 250;
const H = 250;
const dampening = 0.9;

var surfaceShader;
var surfaceTexture;
let current = new Array(W * H).fill(0);
let previous = new Array(W * H).fill(0);

function preload() {
  surfaceShader = loadShader('vs.glsl', 'fs.glsl');
}

function setup() {
  // put setup code here
  createCanvas(windowWidth, windowHeight, WEBGL);
  setAttributes('perPixelLighting', true);

  perspective(PI / 3, this.width / this.height, 0.1, 100);
  camera(0, 3.5, 1, 0, 0, 0, 0, 1, 0);
	
	//rotateY(millis()/3000);

  shader(surfaceShader);
  surfaceShader.setUniform('uTexSize', [W, H]);

  surfaceTexture = createGraphics(W, H);
  surfaceTexture.background(0);
  specularMaterial(255, 255, 255);
  texture(surfaceTexture);
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

  surfaceTexture.loadPixels();

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
      surfaceTexture.set(x, y, val);
    }
  }

  surfaceTexture.updatePixels();

  let temp = previous;
  previous = current;
  current = temp;

  // put drawing code here
  background(50);
  pointLight(255, 255, 255, 5, 10, 5);

  plane(5, 5, W, H);
}
