#ifdef GL_ES
precision highp float;
#endif

uniform sampler2D uSampler;
varying vec2 vTexCoord;

void main() {
  vec2 uv = vTexCoord.xy;
  vec2 tx = vec2(1.0, 0.0);
  
  vec3 col; 

  float dx = (texture2D(uSampler, vTexCoord + tx).r - texture2D(uSampler, vTexCoord - tx).r) / 2.0;
  vec3 nx = clamp(vec3(tx, dx), vec3(0.0), vec3(1.0));
  col += nx;
  
  gl_FragColor = vec4(col, 1.0);
}