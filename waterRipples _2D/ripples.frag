#ifdef GL_ES
precision highp float;
#endif

uniform sampler2D uSampler;
varying vec2 vTexCoord;

void main() {
  vec2 uv = vTexCoord.xy;
  vec2 tx = vec2(1.0, 0.2);
  vec2 ty = vec2(0.0, 1.0);
  vec3 col = vec3(0.0);
  
  float dx = (texture2D(uSampler, vTexCoord + tx).r - texture2D(uSampler, vTexCoord - tx).r) / 2.0;
  float dy = (texture2D(uSampler, vTexCoord + ty).g - texture2D(uSampler, vTexCoord - ty).g) / 2.0;
  vec3 nx = vec3(tx, dx);
  vec3 ny = vec3(ty, dy);
  vec3 nmix = mix(nx, ny, 0.5);
  col = nx;
  gl_FragColor = vec4(col, 1.0);
}