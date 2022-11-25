// This variable will hold our shader object
const W = 100;
const H = 100;

let rippleShader;
let img0;
let fboPrev, fboNext

function preload() {
    img0 = loadImage('assets/rocks.jpeg');
    rippleShader = loadShader('image.frag', 'ripples.vert');
    bufferShader = loadShader('rippes.frag', 'ripples.vert');
}

function setup() {
    // Shaders require WEBGL mode to work
    createCanvas(400, 400, WEBGL);
    setAttributes('perPixelLighting', true);
    pixelDensity(1);
    shader(rippleShader);
    rippleTexture = createGraphics(W, H);
    rippleTexture.background(0);
    texture(rippleTexture);

    // Try changing `float` to `unsigned_byte` to see it leave a trail
    options = {
        colorFormat: 'float'
    }
    fboPrev = createFramebuffer(options)
    fboNext = createFramebuffer(options)

    noStroke();
    noCursor();
}

function draw() {
    // send resolution of sketch into shader
    rippleShader.setUniform('uTexSize', [W, H]);
    rippleShader.setUniform("u_resolution", [width, height]);
    rippleShader.setUniform("u_tex0", img0);
    rippleShader.setUniform("iMouse", [mouseX, map(mouseY, 0, height, height, 0)]);
    rippleShader.setUniform("iFrame", frameCount);
    rippleShader.setUniform("iTime", millis() / 1000.);

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
        rect(0, 0, width, height);
        pop()


        clear();
        push();
        texture(fboNext.color);
        rect(-width / 2, -height / 2, width, height);
        pop();

    });
}