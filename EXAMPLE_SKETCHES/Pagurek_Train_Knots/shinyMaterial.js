const shinyVert = `
precision mediump float;
attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec2 aTexCoord;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat3 uNormalMatrix;

varying vec2 vTexCoord;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vObjPosition;
varying vec3 vRawNormal;

void main(void) {
  vec4 objSpacePosition = vec4(aPosition, 1.0);

  vObjPosition = objSpacePosition.xyz;
  vec4 worldSpacePosition = uModelViewMatrix * objSpacePosition;
  gl_Position = uProjectionMatrix * worldSpacePosition;
  vTexCoord = aTexCoord;
  vPosition = worldSpacePosition.xyz;
  vRawNormal = aNormal;
  vNormal = uNormalMatrix * aNormal;
}
`

const shinyFrag = `
precision mediump float;
varying vec2 vTexCoord;
varying vec3 vRawNormal;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vObjPosition;
uniform mat3 uNormalMatrix;
uniform sampler2D backContent;
uniform sampler2D reflections;
uniform vec2 pixelSize;

void main() {
  vec3 normal = normalize(vNormal);

	vec3 xColor = vec3(89., 240., 232.) / 255.;
	vec3 yColor = vec3(240., 237., 89.) / 255.;
	vec3 zColor = vec3(205., 55., 222.) / 255.;
	float xMix = abs(normal.x);
	float yMix = abs(normal.y);
	float zMix = abs(normal.z);
	gl_FragColor = vec4(
		(xColor*xMix + yColor*yMix + zColor*zMix) / (xMix + yMix + zMix),
		1.
	);
}
`