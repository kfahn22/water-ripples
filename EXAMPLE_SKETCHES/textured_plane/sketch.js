let m1;
let shader1;
let renderer;
let gl;
let img;

function preload() {
  shader1 = loadShader("base.vert", "base.frag");
  img = loadImage("img.png");
}

function setup() {
  renderer = createCanvas(400, 400, WEBGL);
  gl = renderer.GL;

  m1 = new p5.Geometry();
  m1.gid = "uniqueName1";

  const x = 200;

  // equilateral triangle
  m1.vertices = [
    new p5.Vector(-100, -100, 0),
    new p5.Vector(100, -100, 0),
    new p5.Vector(-100, 100, 0),
    new p5.Vector(100, 100, 0)
  ];

  m1.faces = [
    [0, 1, 2],
    [2, 3, 1]
  ];

  // Custom attributes
  m1.custom_vertexColors = [
    1, 0, 0,
    0, 1, 0,
    0, 0, 1,
    1, 1, 1
  ];
  
  m1.uvs = [
    0, 0,
    1, 0,
    0, 1,
    1, 1
  ];
  
  // https://github.com/processing/p5.js/blob/374acfb44588bfd565c54d61264df197d798d121/src/webgl/p5.RendererGL.js#L151
  renderer.retainedMode.buffers.fill.push(

    new p5.RenderBuffer(

      3, // number of components per vertex
      'custom_vertexColors', // src
      'custom_vertexColorsBuffer', // dst
      'aCustomVertexColor', // attribute name
      renderer // renderer
    )
  );
}

function draw() {
  shader(shader1);
  shader1.setUniform("tex0", img);
  noStroke();

  clear();
  rotateZ(frameCount * 0.01);

  model(m1);
}