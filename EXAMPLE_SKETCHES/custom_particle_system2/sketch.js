// copied from aferriss
// https://github.com/aferriss/p5jsShaderExamples

let m1;
let shader1;
let renderer;
let gl;

// How many planes to make
const nPlanes = 10000;

// Base particle size in pixels
const sz = 2.5;

function preload() {
  shader1 = loadShader("base.vert", "base.frag");
}

function setup() {
  renderer = createCanvas(600, 600, WEBGL);
  gl = renderer.GL;

  m1 = new p5.Geometry();
  m1.gid = "uniqueName1";


  m1.vertices = [];
  m1.faces = [];
  m1.uvs = [];
  m1.vertexColors = [];
  m1.id = [];

  for (let i = 0; i < nPlanes; i++) {
    m1.vertices.push(
      new p5.Vector(-1 * sz, -1 * sz, 0),
      new p5.Vector(1 * sz, -1 * sz, 0),
      new p5.Vector(-1 * sz, 1 * sz, 0),
      new p5.Vector(1 * sz, 1 * sz, 0)
    );

    m1.faces.push(
      [0 + i * 4, 1 + i * 4, 2 + i * 4],
      [2 + i * 4, 3 + i * 4, 1 + i * 4]
    );

    m1.vertexColors.push(
      random(), random(), random(), random(),
      random(), random(), random(), random(),
      random(), random(), random(), random(),
      random(), random(), random(), random()
    );

    m1.uvs.push(
      0, 0,
      1, 0,
      0, 1,
      1, 1
    );

    m1.id.push(i, i, i, i);
  }

  // https://github.com/processing/p5.js/blob/374acfb44588bfd565c54d61264df197d798d121/src/webgl/p5.RendererGL.js#L151
  renderer.retainedMode.buffers.fill.push(

    new p5.RenderBuffer(

      1, // number of components per vertex
      'id', // src
      'idBuffer', // dst
      'aId', // attribute name
      renderer // renderer
    )
  );
}

function draw() {
  shader(shader1);
  shader1.setUniform("time", frameCount);
  shader1.setUniform("u_resolution", [width, height]);
  shader1.setUniform("nPlanes", nPlanes);
  noStroke();

  clear();
  rotateZ(frameCount * 0.01);

  model(m1);

}