// This sketch explores how to load an image and manipulate it in a shader
// Using indexes

const W = 100;
const H = 100;
// a shader variable
let imgShader;
let img0;
let current = new Array(W * H).fill(0);
let previous = new Array(W * H).fill(0);

function preload(){
  // load the shader
  img0 = loadImage('bella.jpeg');
  imgShader = loadShader('starter.vert', 'starter.frag');
}

//let fboPrev, fboNext
let canvas

function setup() {
  canvas = createCanvas(400, 400, WEBGL);
  pixelDensity(1);
  // There's a bug in Firefox where you can only make floating point textures
  // if they're RGBA, and it breaks if it's just RGB
  setAttributes({ alpha: true });

  
  // Try changing `float` to `unsigned_byte` to see it leave a trail
  options = { colorFormat: 'float' };
  fboPrev = createFramebuffer(options);
  //fboPrev.background(0, 255, 0);
  fboNext = createFramebuffer(options);
  imageMode(CENTER)
  rectMode(CENTER)
  noStroke();
}

function draw() {
  
    // send resolution of sketch into shader
  imgShader.setUniform('u_resolution', [width, height]);
  imgShader.setUniform("iMouse", [mouseX, map(mouseY, 0, height, height, 0)]);
  imgShader.setUniform("iFrame", frameCount);
  imgShader.setUniform("u_tex0", img0);
  imgShader.setUniform("iTime", millis()/1000.);
  imgShader.setUniform('uTexSize', [W, H]);
    // shader() sets the active shader with our shader
  
  // Swap prev and next so that we can use the previous frame as a texture
  // when drawing the current frame
  [fboPrev, fboNext] = [fboNext, fboPrev]

  // Draw to the Framebuffer
  fboNext.draw(() => {
    clear();

    background(0);

    // Disable depth testing so that the image of the previous
    // frame doesn't cut off the sube
    _renderer.GL.disable(_renderer.GL.DEPTH_TEST);
    push();
    scale(1.003);
    texture(fboPrev.color);
    plane(width, -height);
    //rect(0,0, width, height);
    pop();

    push();
    let x = floor(random(1, W - 1));
	let y = floor(random(1, H - 1));
	previous[x + y * W] = random(10, 255);

  current.loadPixels();
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
        current[i]) * dampening;
      current[i] = val;
      fboNext.set(x, y, val);
    }
  }

    current.updatePixels();
    pop();

  })

  clear()
  push()
  texture(fboNext.color);
  // rect(-width,-height,width,height); // grey first quad
  // rect(0,-height,width,height); // grey 2nd quad -- divided n 2
  // rect(-width,0,width,height); // grey 2nd quad -- divided n 2
  rect(0,0,width,height); // image 4 quad -- divided in 4
  //plane(width, -height);
  pop()
}



  
//   // rect gives us some geometry on the screen
//   rect(0,0,width, height);
