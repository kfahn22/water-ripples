// https://openprocessing.org/sketch/1460113

const W = 200;
const H = 200;

const dampening = 0.991;

var rippleShader;
//var surfaceTexture;
let current = new Array(W * H).fill(0);
let previous = new Array(W * H).fill(0);
let fboPrev, fboNext;
let img;

function preload() {
	rippleShader = loadShader(bufferVert, bufferFrag);
	img = loadImage('assets/rocks.jpeg');
  }
function setup() {
	createCanvas(400, 400, WEBGL);
	// frameRate(1 / 2);
	setAttributes({ alpha: true });
	setAttributes('perPixelLighting', true);
	options = { colorFormat: 'float' };
	fboPrev = createFramebuffer(options);
	fboNext = createFramebuffer(options);

	shader(rippleShader);
	rippleShader.setUniform('uTexSize', [W, H]);
	rippleShader.setUniform('u_tex0', img);
	rippleShader.setUniform('u_resolution', [width, height]);
	noStroke();
	noCursor();
	// imageMode(CENTER)
    // rectMode(CENTER)
	noStroke();
}

function draw() {
  // Swap prev and next so that we can use the previous frame as a texture
  // when drawing the current frame
    [fboPrev, fboNext] = [fboNext, fboPrev]
	
	fboNext.draw(() => {
    clear();
	background(0);
	_renderer.GL.disable(_renderer.GL.DEPTH_TEST);
	push();
    scale(1.003);
    texture(fboPrev.color);
    rect(-width/2, -height/2, width, height);
    pop();

    push();
	// water ripple algorithm
	let x = floor(random(1, W - 1));
	let y = floor(random(1, H - 1));
	previous[x + y * W] = random(10, 255);
  
	if (mouseIsPressed) {
		const x = floor(map(mouseX, 0, width, 0, W));
		const y = floor(map(mouseY, 0, height, 0, H));
		previous[x + y * W] = 500;		
	}
  
	img.loadPixels();
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
		img.set(x, y, val);
    }
  }
    img.updatePixels();
	//rippleShader.setUniform(u_tex0, img);
	pop();
	})

    clear();
	push();
	texture(fboNext.color);
	rect(-width/2, -height/2, width, height);
	pop();
}