// https://openprocessing.org/sketch/1460113

let fboPrev, fboNext;

function setup() {
	createCanvas(400, 400, WEBGL);
	frameRate(1 / 2);
	setAttributes({ alpha: true })
	fboPrev = createFramebuffer();
	fboNext = createFramebuffer();
	options = { colorFormat: 'float' }
	bufferShader = createShader(bufferVert, bufferFrag);
	imageShader = createShader(imageVert, imageFrag);
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
	push();
	shader(imageShader);
	texture(fboPrev.color);
	rect(-width/2, -height/2, width, height);
	pop();
	})

    clear();
	push();
	shader(bufferShader);
	bufferShader.setUniform('uImg', fboNext.color)
	//bufferShader.setUniform('uDepth', fbo.depth)
	bufferShader.setUniform('uSize', [width, height])
	rect(-width/2, -height/2, width, height);
	pop();
}

// function mousePressed() {
// 	saveCanvas('modern_vampires_of_the_city.png')
// }