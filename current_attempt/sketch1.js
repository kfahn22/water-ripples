// Example code
// https://github.com/davepagurek/p5.Framebuffer
let W = 200;
let H = 200;
let fboPrev;
let fboNext;
let canvas;

function preload() {
    img0 = loadImage('assets/rocks.jpeg')
    rippleShader = loadShader('ripples.frag', 'ripples.vert');
  }

function setup() {
  canvas = createCanvas(400, 400, WEBGL)
  // There's a bug in Firefox where you can only make floating point textures
  // if they're RGBA, and it breaks if it's just RGB
  setAttributes({ alpha: true })

  // Try changing `float` to `unsigned_byte` to see it leave a trail
  options = { colorFormat: 'float' };
  fboPrev = createFramebuffer(options);
  fboNext = createFramebuffer(options);
  imageMode(CENTER);
  rectMode(CENTER);
  noStroke();
  noCursor();
}

function draw() {
  // Swap prev and next so that we can use the previous frame as a texture
  // when drawing the current frame
  [fboPrev, fboNext] = [fboNext, fboPrev]

  // Draw to the Framebuffer
  fboNext.draw(() => {
    clear();
    background(0);

    // Disable depth testing so that the image of the previous
    // frame doesn't cut off the sube
    _renderer.GL.disable(_renderer.GL.DEPTH_TEST)
    push();
    rippleShader.setUniform('uTexSize', [W, H]);
    rippleShader.setUniform('u_tex0', fboPrev.color);
    rippleShader.setUniform("iMouse", [mouseX, map(mouseY, 0, height, height, 0)]);
    rippleShader.setUniform("iTime", millis() / 1000.);
    scale(1.003);
    //texture(fboPrev.color);
    shader(rippleShader);
    rect(-width/2, -height/2, width, height);
    pop()

  })

  clear();
  push()
  texture(fboNext.color)
  rect(-width/2, -height/2, width, height);
  pop()
}