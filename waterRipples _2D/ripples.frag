#ifdef GL_ES
precision highp float;
#endif

uniform sampler2D uSampler;
varying vec2 vTexCoord;

void main() {
  vec2 uv = vTexCoord.xy;
  vec2 tx = vec2(1.0, 0.0);
  vec3 col = vec3(0.05, 0.5, 0.8);
  
  float dx = (texture2D(uSampler, aTexCoord + tx).r - texture2D(uSampler, aTexCoord - tx).r) / 2.0;
  
  vec3 nx = vec3(tx, dx);
 
  vec3 col = nx;
 
  gl_FragColor = vec4(col, 1.0);
}