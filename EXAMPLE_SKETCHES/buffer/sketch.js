// https://github.com/davepagurek/p5.Framebuffer

const W = 250;
const H = 250;
// a shader variable
let imgShader;
let imgTexture;
let blob0;
let fboNext = new Array(W * H).fill(0);
let fboPrev = new Array(W * H).fill(0);
let canvas

function preload(){
  // load the shader
  
  
  imgShader = loadShader('starter.vert', 'starter.frag');
}


function setup() {
 
  // shaders require WEBGL mode to work
  canvas = createCanvas(800, 800, WEBGL);
  pixelDensity(1);
   // if they're RGBA, and it breaks if it's just RGB
  setAttributes({ alpha: true })
  // There's a bug in Firefox where you can only make floating point textures
  // Try changing `float` to `unsigned_byte` to see it leave a trail
  options = { colorFormat: 'float' }
  
  imgShader.setUniform('uTexSize', [W, H]);

  imgTexture = createGraphics(W, H);
  imgTexture.background(0, 0, 255);
  //specularMaterial(255, 255, 255);
  texture(imgTexture);
  
  
  fboPrev = createFramebuffer(options)
  
  imgTexture.loadPixels();
  for (let i = 0; i < fboPrev.pixels.length; i += 4) {
    let value = 0;
    if (random(1) < 0.01) value = 255;
    fboPrev.pixels[i + 0] = value;
    fboPrev.pixels[i + 1] = value;
    fboPrev.pixels[i + 2] = value;
    fboPrev.pixels[i + 3] = 255;
  }
  fboPrev.updatePixels();
  fboNext = createFramebuffer(options)
  imageMode(CENTER)
  rectMode(CENTER)
  noStroke()
  
}


function draw() {  
  
  // send resolution of sketch into shader
  theShader.setUniform('u_resolution', [width, height]);
  theShader.setUniform("iMouse", [mouseX, map(mouseY, 0, height, height, 0)]);
  theShader.setUniform("iFrame", frameCount);
  theShader.setUniform("iTime", millis()/1000.);
 
  // Swap prev and next so that we can use the previous frame as a texture
  // when drawing the current frame
  [fboPrev, fboNext] = [fboNext, fboPrev]

  // Draw to the Framebuffer
  fboNext.draw(() => {
    clear()

    background(255)

    // Disable depth testing so that the image of the previous
    // frame doesn't cut off the sube
    _renderer.GL.disable(_renderer.GL.DEPTH_TEST)
    push()
    scale(1.003)
    fboPrev.shader(theShader);
    fboPrev.rect(0, 0, width, height);
    texture(fboPrev.color)
    pop()

//     push()
//     // Fade to white slowly. This will leave a permanent trail if you don't
//     // use floating point textures.
//     fill(255, 1)
//     rect(0, 0, width, height)
//     pop()
//     _renderer.GL.enable(_renderer.GL.DEPTH_TEST)

//     push()
   
//     pop()
  })

  clear()
  push()
  texture(fboNext.color)
  rect(0, 0, width, height)
  pop()

//   background(0);

//   // send resolution of sketch into shader
//   theShader.setUniform('u_resolution', [width, height]);
//   theShader.setUniform("iMouse", [mouseX, map(mouseY, 0, height, height, 0)]);
//   theShader.setUniform("iFrame", frameCount);
//   theShader.setUniform("iTime", millis()/1000.);
 
  
//   // shader() sets the active shader with our shader
//   shader(theShader);
//   //model(cubeObj);
//   // rect gives us some geometry on the screen
//   rect(0,0,width, height);
  
}

