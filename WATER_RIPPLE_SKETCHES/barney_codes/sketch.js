// Idea from:
// https://web.archive.org/web/20160418004149/http://freespace.virgin.net/hugo.elias/graphics/x_water.htm

// Coding Train Videos:
// Stream: https://www.youtube.com/watch?v=5lIl5F1hpTE
// Challenge: https://www.youtube.com/watch?v=BZUdGqeOD0w

// Barney Codes
// https://www.youtube.com/watch?v=qm5cDNbtGig&t=55s

let rippleShader;

// need two buffers
let currBuff, prevBuff;

const damping = 0.99;

function preload() {
  rippleShader = loadShader("ripple.vert", "ripple.frag");
}

function setup() {
  createCanvas(600, 600, WEBGL);
  pixelDensity(1);
  noSmooth();

  // create buffers
  currBuff = createGraphics(width, height);
  currBuff.pixelDensity(1);
  currBuff.noSmooth();

  prevBuff = createGraphics(width, height);
  prevBuff.pixelDensity(1);
  prevBuff.noSmooth();

  // set the shader
  shader(rippleShader);

  rippleShader.setUniform("damping", damping);
  rippleShader.setUniform("res", [width, height]);
}

function draw() {
  // add ripple at mouse
  stroke(255);
  if (mouseIsPressed) {
    point(mouseX - width / 2, mouseY - height / 2);
  }

  // add rain drop
  stroke(random(255));
  point(random(width) - width / 2, random(height) - height / 2);

  // update buffers
  prevBuff.image(currBuff, 0, 0);
  currBuff.image(get(), 0, 0);

  // set the buffers inside the shader
  rippleShader.setUniform("currBuff", currBuff);
  rippleShader.setUniform("prevBuff", prevBuff);

  // give shader geometry to draw on
  rect(-width / 2, -height / 2, width, height);
}
