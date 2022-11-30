const genBezier = function() {
	const cy = random([1, 2, 2, 3])
	const offY = random(TWO_PI)
	
	const arms = random([2,3,4])
  const subArms = random([1,1,2,2,3])
	const loops = random([1,1,2])

  const epicycles = [
    {
      r: (f) => sin(f*arms*TWO_PI) * 40 + 120,
      k: () => loops,
    },
    {
      r: (f) => sin(f*subArms*TWO_PI) * 20 + 90,
      k: () => 2 * arms
    },
  ]
	
	const points = []
	const numSamples = 300
	for (let i = 0; i < numSamples; i++) {
		const frac = i / numSamples
		
		const t = frac * 2 * PI
    let x = 0
    let z = 0
    for (const { r, k } of epicycles) {
      x += r(frac) * cos(k(frac) * t)
      z += r(frac) * sin(k(frac) * t)
    }
		const y = sin(t * cy + offY)*height*0.2
		points.push({ pt: createVector(x, y, z) })
	}
	
	// Add bezier tangent control points to make it smooth
	for (let i = 0; i < points.length; i++) {
		const prev = points[(i - 1 + points.length) % points.length]
		const curr = points[i]
		const next = points[(i + 1) % points.length]
		const tangent = next.pt.copy().sub(prev.pt).mult(1/8)
		curr.left = curr.pt.copy().sub(tangent)
		curr.right = curr.pt.copy().add(tangent)
	}
	
	// Make it join up
	points.push(points[0])
	
	return createBezierPath(points)
}

const bezierToTrackGeom = function(bezier) {
	return new p5.Geometry(1, 1, function() {
    this.gid = 'track'
		const pointSpacing = 0.5
		const numPoints = ceil(bezier.getTotalLength() / pointSpacing)
		const trackSize = 35
		const railThickness = 10
		const crossbeamSpacing = 50
		const numCrossbeams = ceil(bezier.getTotalLength() / crossbeamSpacing)
		const crossbeamIdxSpacing = round(numPoints / numCrossbeams)
		const crossBeamThickness = ceil(5 / pointSpacing)
		
		const up = createVector(0, 1, 0)
		const centers = []
		const tangents = []
		const bitangents = []
		const normals = []
		for (let i = 0; i < numPoints; i++) {
			const frac = i / (numPoints - 1)
			const distance = frac * bezier.getTotalLength()
			const center = bezier.getPointAtLength(distance)
			const tangent = bezier.getTangentAtLength(distance)
			
			// The point along the path
			const centerVec = createVector(center.x, center.y, center.z)
			
			// What direction is the path moving right now?
			const tangentVec = createVector(tangent.x, tangent.y, tangent.z).normalize()
			
			// Take just the xz component (no vertical movement) and rotate it 90 degrees
			// to get the direction the crossbeam should go in
			const bitangentVec = createVector(-tangent.z, 0, tangent.x).normalize()
			
			// The cross product of the tangent and bitangent is the normal, pointing
			// directly out of the track
			const normalVec = tangentVec.copy().cross(bitangentVec).normalize()
			
			centers.push(centerVec)
			tangents.push(tangentVec)
			bitangents.push(bitangentVec)
			normals.push(normalVec)
		}
		
		const trackNumPoints = 2 * numPoints
		
		// Generate rails
		for (const side of [-1, 1]) {
			const trackStart = this.vertices.length
			for (let i = 0; i < numPoints; i++) {
				const frac = i / (numPoints - 1)
				const u = frac

				const center = centers[i]
				const normal = normals[i]
				const tangent = tangents[i]
				const bitangent = bitangents[i]
				
				const faceStart = this.vertices.length
				const pt = center.copy().add(bitangent.copy().mult(side * trackSize / 2))

				for (const v of [0, 1]) {
					this.uvs.push([u, v])
					this.vertices.push(pt.copy().add(bitangent.copy().mult(v * side * railThickness)))
					this.vertexNormals.push(normal)
				}
				const nextFaceStart = i < numPoints - 1
					? faceStart + 2
					: trackStart
				this.faces.push([faceStart, faceStart + 1, nextFaceStart + 1])
				this.faces.push([nextFaceStart + 1, nextFaceStart, faceStart])
				
				// Add crossbeam
				if (i % crossbeamIdxSpacing === 0 && side === 1 && i < numPoints - crossBeamThickness) {
					const nextCrossFaceStart = faceStart + 2 * crossBeamThickness
					this.faces.push([faceStart, nextCrossFaceStart, nextCrossFaceStart - trackNumPoints])
					this.faces.push([nextCrossFaceStart - trackNumPoints, faceStart - trackNumPoints, faceStart])
				}
			}
		}
	})
}