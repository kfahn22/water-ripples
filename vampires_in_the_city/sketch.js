// https://openprocessing.org/sketch/1460113

let fbo
function setup() {
	createCanvas(600, 600, WEBGL)
	frameRate(1 / 3)
	fbo = createFramebuffer()
  depthShader = createShader(vert, frag)
}

const cellSize = 50

const flat = () => {}
const peak = () => {
	for (const corner of [0, 1, 2, 3]) {
		const r = cellSize*sqrt(2)/2
		const verts = [
			[cos((corner+0.5)*PI/2)*r, 0, sin((corner+0.5)*PI/2)*r],
			[cos((corner+1.5)*PI/2)*r, 0, sin((corner+1.5)*PI/2)*r],
			[0, 2*cellSize, 0],
		]
		const [a, b, c] = verts.map((v) => createVector(...v))
		const n = a.copy().sub(b).cross(c.copy().sub(b)).normalize()
		beginShape(TRIANGLES)
		normal(n.x, n.y, n.z)
		for (const vert of verts) {
			vertex(...vert)
		}
		endShape()
	}
}
const slope = () => {
	for (const zSide of [-1, 1]) {
		const verts = [
			[-cellSize/2, 0, zSide * cellSize/2],
			[cellSize/2, 0, zSide * cellSize/2],
			[cellSize/2, cellSize, zSide * cellSize/2],
		]
		const [a, b, c] = verts.map((v) => createVector(...v))
		const n = a.copy().sub(b).cross(c.copy().sub(b)).normalize().mult(-zSide)
		beginShape(TRIANGLES)
		normal(n.x, n.y, n.z)
		for (const vert of verts) {
			vertex(...vert)
		}
		endShape()
	}

	const corners = [
		[-cellSize/2, 0],
		[cellSize/2, 0],
		[cellSize/2, cellSize],
	]
	for (let i = 0; i < corners.length; i++) {
		const verts = []
		for (const off of [0,1]) {
			const [x,y] = corners[(i+off)%corners.length]
			for (const zSide of [-1, 1]) {
				verts.push([x, y, zSide * cellSize/2])
			}
		}
		const [a, b, c] = verts.map((v) => createVector(...v))
		const n = a.copy().sub(b).cross(c.copy().sub(b)).normalize()
		beginShape(TRIANGLE_STRIP)
		normal(n.x, n.y, n.z)
		for (const vert of verts) {
			vertex(...vert)
		}
		endShape()
	}
}
const pieces = [
	flat,
	flat,
	flat,
	flat,
	slope,
	slope,
	slope,
	peak,
]

function draw() {
	const near = 0
	const far = 2 * height
	ortho(-width / 2, width / 2, height / 2, -height / 2, 0, far)
	
	fbo.draw(() => {
    clear()
		push()
		background(0)
		rotateX(PI/4)
		rotateY(-PI/4)

		//normalMaterial()
		noStroke()
		/*specularMaterial('#fff')
		shininess(100)
		ambientLight(100)
		directionalLight(255, 0, 0, 1, -1, -1)
		directionalLight(0, 255, 0, -1, -1, -1)
		directionalLight(0, 0, 255, 0, 1, -1)*/

		const numCells = 30

		scale(0.8)
		translate(-cellSize * numCells / 2, -height * 0.2, -cellSize * numCells / 2)
		for (let x = 0; x < numCells; x++) {
			for (let z = 0; z < numCells; z++) {
				push()
				translate((x+0.5)*cellSize, 0, (z+0.5)*cellSize)
				const h = floor(pow(random(0, 1),3)*5 + 1)*cellSize
				push()
				translate(0, h/2, 0)
				scale(1, h/cellSize, 1)
				box(cellSize)
				pop()
				translate(0, h, 0)
				rotateY(random([0, 1, 2, 3]) * TWO_PI/4)
				random(pieces)()
				pop()
			}
		}
		pop()
	})
	
	clear()

  push()

  noStroke()
  rectMode(CENTER)
  shader(depthShader)
  depthShader.setUniform('uImg', fbo.color)
  depthShader.setUniform('uDepth', fbo.depth)
  depthShader.setUniform('uSize', [width, height])
  
  
  rect(0, 0, width, height)
  pop()
}

function mousePressed() {
	saveCanvas('modern_vampires_of_the_city.png')
}