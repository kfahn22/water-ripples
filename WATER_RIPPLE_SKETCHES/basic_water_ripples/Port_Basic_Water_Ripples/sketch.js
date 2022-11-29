// Based on Water Ripples Coding Challenge by Daniel Shiffman
// https://thecodingtrain.com/challenges/102-2d-water-ripple

let img0, img;
let theShader;
// let oldTime;
// let shaderNdx = 0;
const shaders = [];

function preload() {
    // load the shaders
    shaders.push(loadShader('image.vert', 'bufferA.frag'));
    shaders.push(loadShader('image.vert', 'bufferB.frag'));
    shaders.push(loadShader('image.vert', 'image.frag'));
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

    // Initialize the buffer
    buffer = createGraphics(400, 400, WEBGL);
    img0 = buffer.createImage(400, 400);
    img0.loadPixels();
    for (let i = 0; i < img0.pixels.length; i += 4) {
        let val = 0;
        if (random(1) < 0.01) val = 255;
        img0.pixels[i + 0] = val;
        img0.pixels[i + 1] = val;
        img0.pixels[i + 2] = val;
        img0.pixels[i + 3] = 255;
    }
    img0.updatePixels();
    current = createGraphics(400, 400, WEBGL);
    img = current.createImage(400, 400);
    //imageMode(CENTER);
}

function mousePressed() {
    // previous.loadPixels();
}

function draw() {
    // switch shaders every second
    // let time = performance.now() / 1000 | 0; // convert to seconds
    // if (oldTime !== time) {
    //     oldTime = time;
    //     // increment shader index to the next shader but wrap around 
    //     // back to 0 at then of the array of shaders
    //     shaderNdx = (shaderNdx + 1) % shaders.length;
    //     theShader = shaders[shaderNdx]
    // }
    //theShader.setUniform("u_resolution", [width, height]);
    //buffer.shader(theShader);
    //buffer.rect(0, 0, width, height);
    background(220);
    // start with bufferA
    if (theShader == shaders[0]) {
       theShader.setUniform("u_resolution", [width, height]);
        theShader.setUniform("u_tex0", img0);
        buffer.shader(theShader);
        texture(buffer);
        buffer.rect(0, 0, width, height);
        img.loadPixels();
        img.copy(buffer, -width, -height, width, height, 0, 0, 2 * width, 2 * height);
        img.updatePixels();
        // switch to bufferB
        theShader = shaders[1];
    } else if (theShader == shaders[1]) {
        // want to update image passed to shader
        theShader.setUniform("u_resolution", [width, height]);
        theShader.setUniform("u_tex0", img);
        buffer.shader(theShader);
        texture(buffer);
        buffer.rect(0, 0, width, height);
        img.copy(buffer, -width, -height, width, height, 0, 0, 2 * width, 2 * height);
        img.updatePixels();
        theShader = shaders[2];
    } else if (theShader == shaders[2]) {
      // want to update image passed to shader
      theShader.setUniform("u_resolution", [width, height]);
      theShader.setUniform("u_tex0", img);
      buffer.shader(theShader);
      texture(buffer);
      buffer.rect(0, 0, width, height);
      img.copy(buffer, -width, -height, width, height, 0, 0, 2 * width, 2 * height);
      img.updatePixels();
      // switch back to buffer A
      theShader = shaders[0];
    }
   
    image(buffer, -width / 2, -height / 2);
}