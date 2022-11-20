
let W = 40;
let H = 40;
let imgShader;
// let imgTexture;
function preload(){
  // load the shader
  img0 = loadImage('bella.jpeg');
  img1 = loadImage('jelly.jpeg');
  imgShader = loadShader('starter.vert', 'starter.frag');
}

let fboPrev, fboNext
let canvas

function setup() {
  canvas = createCanvas(400, 400, WEBGL)
  // There's a bug in Firefox where you can only make floating point textures
  // if they're RGBA, and it breaks if it's just RGB
  setAttributes({ alpha: true })

  // Try changing `float` to `unsigned_byte` to see it leave a trail
  options = { colorFormat: 'float' }
  fboPrev = createFramebuffer(options)
  fboNext = createFramebuffer(options)
  // imageMode(CENTER)
  // rectMode(CENTER)
  noStroke()
}

function draw() {
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
    texture(fboPrev.color)
    plane(width, -height)
    pop()

    push()
    
   
    pop()
    _renderer.GL.enable(_renderer.GL.DEPTH_TEST)

    push()
    
    // send resolution of sketch into shader
    imgShader.setUniform('u_resolution', [width, height]);
    imgShader.setUniform("iMouse", [mouseX, map(mouseY, 0, height, height, 0)]);
    imgShader.setUniform("iFrame", frameCount);
    imgShader.setUniform("iTime", millis()/1000.);
    imgShader.setUniform('uTexSize', [W, H]);
    imgShader.setUniform("u_tex0", img0);
    imgShader.setUniform("u_tex1", img1);
      // shader() sets the active shader with our shader
    shader(imgShader);
    
  // rect gives us some geometry on the screen
  
    rect(0,0, width, height);
    pop()
  })

  clear()
  push()
  texture(fboNext.color)
  plane(width, -height)
  pop()
}



