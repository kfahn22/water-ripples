
let img;
let buffer, current;
let theShader;
let oldTime;
let shaderNdx = 0;
const shaders = [];

function preload() {
    // load the shaders
    shaders.push(loadShader('shader.vert', 'shader1.frag'));
    shaders.push(loadShader('shader.vert', 'shader2.frag'));
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
    current = createGraphics(400, 400, WEBGL);
    img = createImage(400,400);
    img.loadPixels();
    for (let i = 0; i < img.pixels.length; i += 4) {
        let val = 0;
        if (random(1) < 0.01) val = 255;
        img.pixels[i + 0] = val;
        img.pixels[i + 1] = val;
        img.pixels[i + 2] = val;
        img.pixels[i + 3] = 255;
    }
    img.updatePixels();
    
    //imageMode(CENTER);
}

function mousePressed() {
    // previous.loadPixels();
}

function draw() {
    background(220);
    if (theShader == shaders[0]) {
        theShader.setUniform("u_resolution", [width, height]);
        theShader.setUniform("u_tex0", img);
        buffer.shader(shaders[0]);
        texture(buffer);
        buffer.rect(0, 0, width, height);
        img.loadPixels();
        img.copy(buffer, -width, -height, width, height, 0, 0, 2 * width, 2 * height);
        img.updatePixels();
        theShader = shaders[1];
    } else {
        // want to update image passed to shader
        theShader.setUniform("u_resolution", [width, height]);
        theShader.setUniform("u_tex0", img);
        current.shader(shaders[1]);
        texture(current);
        current.rect(0, 0, width, height);
        img.loadPixels();
        img.copy(current, -width, -height, width, height, 0, 0, 2 * width, 2 * height);
        img.updatePixels();
        theShader = shaders[0];
    }

    background(0);
    
    rect(-width/2, -height/2, width, height);
}