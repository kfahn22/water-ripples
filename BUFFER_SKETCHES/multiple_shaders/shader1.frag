#ifdef GL_ES
precision highp float;
#endif

uniform vec2 u_resolution;
uniform sampler2D u_tex0;
uniform sampler2D uSampler;
uniform vec2 iMouse;
uniform float iTime;

#define S smoothstep
#define FUSHIA vec3(236,1,90)/255.
#define GREEN vec3(102, 211, 52)/255.

varying vec2 vTexCoord;

float Dot(vec2 uv, float x, float y) {
  x = mix(-0.8, 0.8, x);
 return S(0.01, 0.0, length(uv-vec2(x,y)) - 0.02);
}

void main() {
  vec2 uv = (2.0 * gl_FragCoord.xy - u_resolution.xy)/ u_resolution.y;
  vec2 st = vTexCoord;
  //vec2 st = gl_FragCoord.xy / u_resolution.xy;
  vec3 col = texture2D(u_tex0, st).rgb;
  float x = min(1., iTime);
  col += GREEN*Dot(uv, x, 0.0);
  
  gl_FragColor = vec4(col, 1.0);
}