// This variable will hold our shader object
let shaderProgram;

// This variable will hold our vertex shader source code
let vertSrc = `
   attribute vec3 aPosition;
   attribute vec2 aTexCoord;
   uniform mat4 uProjectionMatrix;
   uniform mat4 uModelViewMatrix;
   varying vec2 vTexCoord;

   void main() {
     vTexCoord = aTexCoord;
     vec4 position = vec4(aPosition, 1.0);
     gl_Position = uProjectionMatrix * uModelViewMatrix * position;
   }
`;

// This variable will hold our fragment shader source code
let fragSrc = `
   precision mediump float;

   varying vec2 vTexCoord;

   void main() {
     vec2 uv = vTexCoord;
     vec3 color = vec3(uv.x, uv.y, min(uv.x + uv.y, 1.0));
     gl_FragColor = vec4(color, 1.0);
   }
`;

function setup() {
  // Shaders require WEBGL mode to work
  createCanvas(300, 300, WEBGL);

  // Create our shader
  shaderProgram = createShader(vertSrc, fragSrc);

  describe(
    'Two rotating cubes. The left one is painted using a custom (user-defined) shader, while the right one is painted using the default fill shader.'
  );
}

function draw() {
  // Clear the scene
  background(200);

  // Draw a box using our shader
  // shader() sets the active shader with our shader
  shader(shaderProgram);
  push();
  translate(-width / 4, 0, 0);
  rotateX(millis() * 0.00025);
  rotateY(millis() * 0.0005);
  box(width / 4);
  pop();

  // Draw a box using the default fill shader
  // resetShader() restores the default fill shader
  resetShader();
  fill(255, 0, 0);
  push();
  translate(width / 4, 0, 0);
  rotateX(millis() * 0.00025);
  rotateY(millis() * 0.0005);
  box(width / 4);
  pop();
}