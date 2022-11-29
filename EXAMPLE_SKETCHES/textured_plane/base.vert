attribute vec3 aPosition;
attribute vec3 aCustomVertexColor;
attribute vec2 aTexCoord;

uniform mat4 uProjectionMatrix;
uniform mat4 uModelViewMatrix;
uniform mat3 uNormalMatrix;

varying vec3 vVertexColor;
varying vec2 vTexCoord;

void main ()
{
	vVertexColor = aCustomVertexColor;
    vTexCoord = aTexCoord;

	vec4 positionVec4 = vec4( aPosition , 1.0 );

	gl_Position = uProjectionMatrix * uModelViewMatrix * positionVec4;
}