precision highp float;
varying vec3 vVertexColor;
varying vec2 vTexCoord;


void main ()
{
	gl_FragColor = vec4( vVertexColor, 1.0 );
}