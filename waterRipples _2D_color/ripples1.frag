#ifdef GL_ES
precision highp float;
#endif

uniform sampler2D uSampler;
uniform sampler2D u_tex0;
varying vec2 vTexCoord;

void main() {
  vec2 uv = 2* vTexCoord.xy;
  vec2 tx = vec2(1.0, 0.0);
  
  vec3 col; 
  vec3 imgTex = texture2D(u_tex0, uv).rgb;

  float dx = (texture2D(uSampler, vTexCoord + tx).r - texture2D(uSampler, vTexCoord - tx).r) / 2.0;
  vec3 nx = clamp(vec3(tx, dx), vec3(0.0), vec3(1.0));
  col += nx;
  vec3 finalColor = vec3(0.0);
  finalColor.g = imgTex.r;
  finalColor.r = dx;
  gl_FragColor = vec4(col, 1.0);
}