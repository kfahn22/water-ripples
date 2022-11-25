new p5(sa => {
    // This variable will hold our shader object
    const W = 100;
    const H = 100;
    let rippleShader;
    let img0;
    let fboPrev, fboNext

    sa.preload = () => {
        img0 = sa.loadImage('assets/rocks.jpeg');
        rippleShader = sa.loadShader('ripples.frag', 'ripples.vert');
    }

    sa.setup = () => {
        // Shaders require WEBGL mode to work
        c0 = sa.createCanvas(400, 400, sa.WEBGL);
        sa.setAttributes('perPixelLighting', true);
        sa.pixelDensity(1);
        sa.shader(rippleShader);
        rippleShader.setUniform('uTexSize', [W, H]);
        rippleTexture = sa.createGraphics(W, H);
        rippleTexture.background(0);
        sa.texture(rippleTexture);

        // Try changing `float` to `unsigned_byte` to see it leave a trail
        options = {
            colorFormat: 'float'
        }
        fboPrev = createFramebuffer(options)
        fboNext = createFramebuffer(options)

        sa.noStroke();
        sa.noCursor();
    }

    sa.draw = () => {
        // send resolution of sketch into shader
        rippleShader.setUniform('uTexSize', [W, H]);
        rippleShader.setUniform("u_resolution", [sa.width, sa.height]);
        rippleShader.setUniform("u_tex0", img0);
        rippleShader.setUniform("iMouse", [sa.mouseX, sa.map(sa.mouseY, 0, sa.height, sa.height, 0)]);
        rippleShader.setUniform("iFrame", sa.frameCount);
        rippleShader.setUniform("iTime", sa.millis() / 1000.);

        // Swap prev and next so that we can use the previous frame as a texture
        // when drawing the current frame
        [fboPrev, fboNext] = [fboNext, fboPrev]

        // Draw to the Framebuffer
        fboNext.draw(() => {
            sa.clear()
            sa.background(255)

            // Disable depth testing so that the image of the previous
            // frame doesn't cut off the sube
            _renderer.GL.disable(_renderer.GL.DEPTH_TEST)
            sa.push()
            sa.scale(1.003)
            fboPrev.shader(rippleShader);
            fboPrev.rect(0, 0, width, height);
            sa.texture(fboPrev.color)
            sa.pop()


            sa.clear();
            sa.push();
            sa.texture(fboNext.color);
            sa.rect(-sa.width / 2, -sa.height / 2, sa.width, sa.height);
            sa.pop();

        });
    }
});

// new p5(sb => {
//     // This variable will hold our shader object
//     const W = 100;
//     const H = 100;
//     let rippleShader;
//     let img0;
//     let img;

//     sb.preload = () => {
//         img0 = sb.loadImage('assets/rocks.jpeg');
//         rippleShader = sb.loadShader('image.frag', 'ripples.vert');
//         //rippleShader = sb.loadShader('ripples.frag', 'ripples.vert');
//     }

//     sb.setup = () => {
//         // Shaders require WEBGL mode to work
//         c1 = sb.createCanvas(400, 400, sb.WEBGL);
//         sb.setAttributes('perPixelLighting', true);
//         sb.createGraphics(400, 400, sb.WEBGL)
//         sb.shader(rippleShader);

//         // get image from local storage
//         //sb.texture(img0);
//         // img = sb.getItem(`img0`);
//         // if (img !== null) {
//         //     img = sb.loadImage(img);
//         //     sb.texture(img);
//         // } else {
//         //     sb.texture(img0);
//         // }
//         sb.noStroke();
//         sb.noCursor();
//     }

//     sb.draw = () => {
//         sb.background(0);
//         rippleShader.setUniform('uTexSize', [W, H]);
//         rippleShader.setUniform('u_tex0', img0);
//         rippleShader.setUniform("u_resolution", [sb.width, sb.height]);
//         rippleShader.setUniform("iMouse", [sb.mouseX, sb.map(sb.mouseY, 0, sb.height, sb.height, 0)]);
//         rippleShader.setUniform("iFrame", sb.frameCount);
//         rippleShader.setUniform("iTime", sb.millis() / 1000.);


//         sb.push();
//         sb.clear();
//         sb.shader(rippleShader);
//         sb.storeItem("img0", c1.elt.toDataURL());
//         sb.rect(-sb.width / 2, -sb.height / 2, sb.width, sb.height);
//         sb.pop();
//     }
// });