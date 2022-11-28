let rippleShader;
let img0;
let previous;

function preload() {
  rippleShader = loadShader("ripples.vert", "ripples.frag");
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
  previous = createGraphics(400, 400, WEBGL);
  img0 = previous.createImage(400, 400);
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
  buffer = createGraphics(400, 400, WEBGL);
}

function mousePressed() {
  // previous.loadPixels();
}

function draw() {
  background(220);
  rippleShader.setUniform("u_resolution", [width, height]);
  rippleShader.setUniform("u_tex0", img0);
  rippleShader.setUniform("iMouse", [mouseX, map(mouseY, 0, height, height, 0)]);
  rippleShader.setUniform("iTime", millis()/1000.);
  //texture(buffer);
  buffer.shader(rippleShader);
  buffer.rect(0, 0, width, height);
  // img0.copy(buffer, 0, 0, width, height, 0, 0, width, height);
  // img0.updatePixels();

  let temp = previous;
  previous = buffer;
  buffer = temp;
  image(buffer, -width / 2, -height / 2);
  
  // if (mouseIsPressed) {
  //   for (let i = 0; i < img0.pixels.length; i += 4) {
  //     if (random(1) < 0.01) {
  //       img0.pixels[i + 0] = 255;
  //       img0.pixels[i + 1] = 255;
  //       img0.pixels[i + 2] = 255;
  //       img0.pixels[i + 3] = 255;
  //     }
  //   }
  //   img0.updatePixels();
  // }
}
