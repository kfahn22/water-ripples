

const W = 600;
const H = 600;
// a shader variable
let imgShader;
let img0;

let fboNext;
let fboPrev = new Array(W * H).fill(255, 0, 0);
// let canvas

function preload(){
  // load the shader
  img0 = loadImage('bella.jpeg');
  imgShader = loadShader('starter.vert', 'cell.frag');
}

//let fboPrev, fboNext
let canvas

function setup() {
  canvas = createCanvas(600, 600, WEBGL);
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
  //rectMode(CENTER)
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
    pop();

    push();
    // Fade to white slowly. This will leave a permanent trail if you don't
    // use floating point textures.
    shader(imgShader);
    rect(0, 0, width, height);
    // image(fboPrev, -width / 2, -height / 2);
    // rect(0, 0, width, height);
    // img0.copy(fboPrev, 0, 0, width, height, 0, 0, width, height);
    // img0.updatePixels();
    pop()
    _renderer.GL.enable(_renderer.GL.DEPTH_TEST)

    // push()
    // //normalMaterial()
    // fill(255,0,255);
    // translate(100*sin(frameCount * 0.014), 100*sin(frameCount * 0.02), 0)
    // rotateX(frameCount * 0.01)
    // rotateY(frameCount * 0.01)
    // rect(0,0, 20, 20);
    // pop()
  })

  clear()
  push()
  texture(fboNext.color)
  plane(width, -height)
  pop()
}



  
//   // rect gives us some geometry on the screen
//   rect(0,0,width, height);
