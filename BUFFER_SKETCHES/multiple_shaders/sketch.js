// https://stackoverflow.com/questions/62418710/fading-between-shadertoy-shaders-in-p5-js

let theShader;
let oldTime;
let shaderNdx = 0;

const shaders = [];

function preload() {
  // load the shaders
  shaders.push(loadShader('shader1.vert', 'shader1.frag'));
  shaders.push(loadShader('shader2.vert', 'shader2.frag'));
  theShader = shaders[0]; // start with the first shader
}

function setup() {
  //creates canvas
  createCanvas(400, 400, WEBGL);
  noStroke();
}

function draw() {
  // switch shaders every second
  let time = performance.now() / 1000 | 0; // convert to seconds
  if (oldTime !== time) {
    oldTime = time;
    // increment shader index to the next shader but wrap around 
    // back to 0 at then of the array of shaders
    shaderNdx = (shaderNdx + 1) % shaders.length;
    theShader = shaders[shaderNdx]

  }

  //sets the active shader
  shader(theShader);

  theShader.setUniform("iResolution", [width, height]);
  theShader.setUniform("iFrame", frameCount);
  theShader.setUniform("iMouse", [mouseX, map(mouseY, 0, height, height, 0)]);
  theShader.setUniform("iTime", millis() / 1000.0);
  theShader.setUniform("u_resolution", [width, height]);
  theShader.setUniform("u_time", millis() / 1000.0);
  theShader.setUniform("u_mouse", [mouseX, map(mouseY, 0, height, height, 0)]);

  // rect gives us some geometry on the screen
  rect(0, 0, width, height);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}