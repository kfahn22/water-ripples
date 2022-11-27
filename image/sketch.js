// This sketch draws an image to the screen using a shader
// Completely unnecessary to do, but needed to get the syntax correct

let img;
function preload() {
    img = loadImage('assets/rocks.jpeg');
    imgShader = loadShader('image.frag', 'image.vert');
}

function setup() {
    // put setup code here
    createCanvas(500, 500, WEBGL);
    pixelDensity(1);
    noStroke();
    noCursor();
    rectMode(CENTER);
}

function draw() {
    imgShader.setUniform("u_resolution", [width, height]);
    imgShader.setUniform("u_tex0", img);
    shader(imgShader);
    texture(img);
    rect(0,0, width, height);
}