let img0;

const shaders = [];

function preload() {
  // load the shaders
  shaders.push(loadShader('shader1.vert', 'shader1.frag'));
  shaders.push(loadShader('shader2.vert', 'shader2.frag'));
  //shaders.push(loadShader('shader3.vert', 'shader3.frag'));
  theShader = shaders[0]; // start with the first shader
}

// function mouseDragged() {
//   let i = (mouseX + mouseY * img0.width) * 4;
//   img0.loadPixels();
//   img0.pixels[i + 0] = 255;
//   img0.pixels[i + 1] = 255;
//   img0.pixels[i + 2] = 255;
//   img0.pixels[i + 3] = 255;
//   img0.updatePixels();
// }

function setup() {
  createCanvas(400, 400, WEBGL);
  pixelDensity(1);

  buffer = createGraphics(400, 400, WEBGL);
  current = createGraphics(400,400, WEBGL);
  img0 = buffer.createImage(400, 400);
  img0.loadPixels();
  for (let i = 0; i < img0.pixels.length; i += 4) {
    let value = 0;
    if (random(1) < 0.01) value = 255;
    img0.pixels[i + 0] = value;
    img0.pixels[i + 1] = value;
    img0.pixels[i + 2] = value;
    img0.pixels[i + 3] = 255;
  }
  img0.updatePixels();
}

function mousePressed() {
  // previous.loadPixels();
}

function draw() {
  background(220);
  theShader.setUniform("u_resolution", [width, height]);
  theShader.setUniform("u_tex0", img0);
  buffer.shader(theShader);
  buffer.rect(0, 0, width, height);
  img0.copy(buffer, 0, 0, width, height, 0, 0, width, height);
  img0.updatePixels();
  image(buffer, -width / 2, -height / 2);
}