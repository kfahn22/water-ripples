//https://medium.com/@edoueda/integrating-p5-js-and-webgl-with-react-js-96c848a63170

// This variable will hold our shader object
const W = 400;
const H = 400;

let feedbackShader;
let img0;
let preImg, currImg

function preload() {
    img0 = loadImage('assets/rocks.jpeg');
    feedbackShader = loadShader('ripples.frag', 'ripples.vert');
    
}

function setup() {
    // Shaders require WEBGL mode to work
    createCanvas(400, 400, WEBGL);
    setAttributes('perPixelLighting', true);
    pixelDensity(1);
    
    prevImg = createGraphics(W, H);
    prevImg.background(0);

    currImg = createGraphics(W, H, WEBGL);
    noStroke();
    noCursor();
}

function draw() {
    currImg.shader(feedbackShader);
    // send resolution of sketch into shader
    feedbackShader.setUniform('uTexSize', [W, H]);
    feedbackShader.setUniform("u_resolution", [width, height]);
    feedbackShader.setUniform("u_tex0", prevImg);
    feedbackShader.setUniform("iMouse", [mouseX, map(mouseY, 0, height, height, 0)]);
    feedbackShader.setUniform("iFrame", frameCount);
    feedbackShader.setUniform("iTime", millis() / 1000.);

     //we need a rect for frag shader to draw onto
     currImg.rect(width/2,-height/2,width,height)

     //copy the currImg and set it as previous
     prevImg.image(currImg, 0,0,width,height)

     //show the results
     image(currImg, -width/2,-height/2,width,height)
}