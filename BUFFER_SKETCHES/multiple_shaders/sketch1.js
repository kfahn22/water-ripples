let img0, img1;
let img;
let theShader;
let oldTime;
let shaderNdx = 0;
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
    current = createGraphics(400, 400, WEBGL);
    img0 = buffer.createImage(400, 400);
    img1 = current.createImage(400, 400);
    img0.loadPixels();
    for (let i = 0; i < img0.pixels.length; i += 4) {
        let value = 0;
        //if (random(1) < 0.01) value = 255;
        img0.pixels[i + 0] = 248; //value;
        img0.pixels[i + 1] = 158; //value;
        img0.pixels[i + 2] = 79; //value;
        img0.pixels[i + 3] = 255;
    }
    img0.updatePixels();
    //img1.copy(img0, )
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
    if (theShader == shaders[0]) {
       theShader.setUniform("u_resolution", [width, height]);
        theShader.setUniform("u_tex0", img0);
        buffer.shader(theShader);
        texture(buffer);
        buffer.rect(0, 0, width, height);
        img1.loadPixels();
        img1.copy(buffer, -width, -height, width, height, 0, 0, 2 * width, 2 * height);
        img1.updatePixels();

        theShader = shaders[1];
    } else {
        // want to update image passed to shader
        theShader.setUniform("u_resolution", [width, height]);
        theShader.setUniform("u_tex0", img1);
        buffer.shader(theShader);
        buffer.rect(0, 0, width, height);
        img0.copy(buffer, -width, -height, width, height, 0, 0, 2 * width, 2 * height);
        img0.updatePixels();
        theShader = shaders[0];
    }
   
    image(buffer, -width / 2, -height / 2);
}