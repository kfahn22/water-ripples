#ifdef GL_ES
precision highp float;
#endif

uniform vec2 u_resolution;
uniform sampler2D u_tex0;
uniform sampler2D uSampler;
uniform vec2 iMouse;
uniform float iTime;

varying vec2 vTexCoord;

#define S smoothstep
#define PURPLE vec3(146,83,161)/255.

float Dot(vec2 uv, float x, float y) {
  y = mix(-0.8, 0.8, y);
 return S(0.01, 0.0, length(uv-vec2(x,y)) - 0.02);
}

void main() {
  vec2 uv = (2.0 * gl_FragCoord.xy - u_resolution.xy)/ u_resolution.y;
  vec2 st = vTexCoord;
  //vec2 st = gl_FragCoord.xy / u_resolution.xy;
  vec3 col = texture2D(u_tex0, st).rgb;
  float y = min(1., iTime);
  col += PURPLE*Dot(uv, 0.0, y);

  gl_FragColor = vec4(col, 1.0);
}