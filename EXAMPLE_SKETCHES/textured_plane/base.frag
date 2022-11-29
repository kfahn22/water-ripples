precision highp float;
varying vec3 vVertexColor;
varying vec2 vTexCoord;

uniform sampler2D tex0;

void main (){
	gl_FragColor = texture2D(tex0, vTexCoord);
}