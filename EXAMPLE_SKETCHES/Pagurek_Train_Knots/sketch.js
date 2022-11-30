/*
https://openprocessing.org/sketch/1590159
Train Knots, by Dave Pagurek

Main files:
- genTrack
  - Generates a knot shape using a Spirograph sort of method
	  (circles rotating on circles)
	- Sweeps a line about the path to create the strip shape of
	  the track
	- Creates and saves it to a p5.Geometry so the data doesn't
	  need to be recreated each frame
- mySketch
  - Generates a new track every little while
	- Calculates the orientation at different positions on the
	  path so that we can place a train on it

Internal stuff:
- shinyMaterial
  - It's normalMaterial() but with different colors so that
	  other programmers don't think I'm lazy :')
- BezierPath
  - A class to represent a 3D curve, which does some math for
	  me (like getting tangent vectors.) Not strictly necessary
		for the type of curve I use here but it works :')
- Framebuffer
  - A WebGL-only faster offscreen canvas implementation
	- See https://github.com/davepagurek/p5.Framebuffer/
	- Used for the blur shader
- blur
  - A shader I've been using for a while to do the depth of field

*/

p5.disableFriendlyErrors = true

let fbo
let blurShader
let shinyShader
let trainCar
let trainFront

function preload() {
	trainCar = loadModel('train-car.obj', true, () => {})
	trainFront = loadModel('train-front.obj', true, () => {})
}

function setup() {
  createCanvas(600, 600, WEBGL)
  
  fbo = new Framebuffer(window)
  blurShader = createShader(vert, frag)
	shinyShader = createShader(shinyVert, shinyFrag)
}

let path
let shape
let rotY
function regenerate() {
	if (shape) {
		_renderer._freeBuffers(shape.gid)
	}
	path = genBezier()
	shape = bezierToTrackGeom(path)
	rotY = random([-1,1]) * random(0.0001, 0.0002)
}

let lastShapeIdx = -1
function draw() {
	const millisPerShape = 10000
	const shapeIdx = floor(millis() / millisPerShape)
	if (!shape || shapeIdx !== lastShapeIdx) {
		regenerate()
		lastShapeIdx = shapeIdx
	}
	
	const trainSpeed = 0.0001
	
  const eyeZ = (height/2) / tan(PI/6)
  const near = eyeZ/10
  const far = eyeZ*10
  perspective(PI/3, width/height, near, far)
  
  const trainHeight = 30
	const trainLength = 75
	const trainCarSpacing = 15
	const trainCars = 4
  
  const targetDepth = 500 + 150 * sin(millis() * 0.001)
  const blurIntensity = 0.015
  
  fbo.draw(() => {
    clear()
    push()
		
		noStroke()
    
		_renderer.GL.disable(_renderer.GL.DEPTH_TEST)
		beginShape(TRIANGLE_STRIP)
		fill(255)
		vertex(-width/2, -height/2)
		vertex(width/2, -height/2)
		fill(228, 246, 247)
		vertex(-width/2, height/2)
		vertex(width/2, height/2)
		endShape()
		_renderer.GL.enable(_renderer.GL.DEPTH_TEST)
		
		shader(shinyShader)
		rotateX(-PI*0.2)
		rotateY(millis() * rotY)
		model(shape)
		
		for (let i = 0; i < trainCars; i++) {
			const trackPosition = (
				millis() * trainSpeed * path.getTotalLength() +
				i * (trainLength + trainCarSpacing)
			) % path.getTotalLength()
			const trainLoc = path.getPointAtLength(trackPosition)

			const rawTrainTangent = path.getTangentAtLength(trackPosition)
			const trainTangent = createVector(rawTrainTangent.x, rawTrainTangent.y, rawTrainTangent.z).normalize()
			const bitangent = createVector(-trainTangent.z, 0, trainTangent.x).normalize()
			const normal = trainTangent.copy().cross(bitangent).normalize()
			push()
			translate(trainLoc.x, trainLoc.y, trainLoc.z)

			// Without any rotation, the 3D basis vectors point exactly along the x, y, and z axes.
			// I want to rotate the train such that:
			//   - the old x axis now points towards `trainTangent` (the direction of the rails)
			//   - the old y axis now points towards the track's normal (directly out from the track)
			//   - the old z axis now points towards the bitangent (the direction of the crossbeams)
			// The matrix applying this rotation is simply each of these new basis vectors
			// concatenated together: [bx by bz]. (The identity matrix is kind of already like this, as
			// the first column is the x axis basis, then the y axis basis, then the z axis basis. Since
			// those are the initial bases, you can think of this as a rotation from those bases to the
			// same thing, which is no rotation at all.)
			applyMatrix(
				trainTangent.x, trainTangent.y, trainTangent.z, 0,
				normal.x, normal.y, normal.z, 0,
				bitangent.x, bitangent.y, bitangent.z, 0,
				0, 0, 0, 1,
			)
			translate(0, trainHeight / 2, 0)
			scale(1 / 200) // p5 normalizes to this
			scale(trainLength, trainHeight * 2, trainHeight * 2)
			model(i === trainCars - 1 ? trainFront : trainCar)
			pop()
		}
		
		pop()
  })
  
  clear()

  push()

  noStroke()
  rectMode(CENTER)
  shader(blurShader)
  _renderer.getTexture(fbo.depth).setInterpolation(
    _renderer.GL.NEAREST,
    _renderer.GL.NEAREST
  )
  blurShader.setUniform('uImg', fbo.color)
  blurShader.setUniform('uDepth', fbo.depth)
  blurShader.setUniform('uSize', [width, height])
  // try replacing blurIntensity with 0 to see an unblurred version
  blurShader.setUniform('uIntensity', blurIntensity)
  blurShader.setUniform('uNumSamples', 25)
  blurShader.setUniform('uTargetZ', targetDepth)
  blurShader.setUniform('uNear', near)
  blurShader.setUniform('uFar', far)
  
  
  rect(0, 0, width, -height)
  pop()
}