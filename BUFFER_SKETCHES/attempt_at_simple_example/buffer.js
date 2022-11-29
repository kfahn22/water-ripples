const bufferVert = `
#ifdef GL_ES
precision highp float;
#endif

attribute vec3 aPosition;
attribute vec2 aTexCoord;

varying vec2 vTexCoord;

void main() {
  vec4 positionVec4 = vec4(aPosition, 1.0);
  positionVec4.xy = positionVec4.xy * 2.0 - 1.0;
  gl_Position = positionVec4;
  
  vTexCoord = aTexCoord;
`
const bufferFrag = `
#ifdef GL_ES
precision highp float;
#endif

uniform sampler2D u_tex0; // texture from image
uniform sampler2D uImg0; // texture from next
uniform vec2 u_resolution;
uniform float iTime;
uniform float iMouse;
uniform vec2 uTexSize; 
varying vec2 vTexCoord;

void main()
{
	vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec4 col = texture2D(uImg, uv);
    vec2 step = 1. / u_resolution.xy;
    
    vec4 n = texture2D( uImg, uv + step * vec2( 0., 1.) );
    vec4 s = texture2D( uImg, uv + step * vec2( 0., -1.) );
    vec4 e = texture2D( uImg, uv + step * vec2( 1., 0.) );
    vec4 w = texture2D( uImg, uv + step * vec2( -1., 0.) );

    // water logic
    // https://web.archive.org/web/20080618181901/http://freespace.virgin.net/hugo.elias/graphics/x_water.htm
    float damping = 0.997;
    float text = ( ( n.r + s.r + e.r + w.r ) * 0.5 - col.g ) * damping;
    
    // simulate buffer swapping with channels r,g
    vec3 finalColor = vec3(0.);
    finalColor.g = col.r;
    finalColor.r = text;
    gl_FragColor = vec4(finalColor, 1.);
}
`