#ifdef GL_ES
precision highp float;
#endif

uniform vec2 u_resolution;
uniform sampler2D u_tex0;
uniform vec2 uTexSize;
////uniform sampler2D u_tex1;
uniform sampler2D uSampler;
//uniform bool isTexture;

varying vec2 vTexCoord;
vec2 tx = vec2(1.0/uTexSize.x, 0.0);
vec2 ty = vec2(0.0, 1.0/uTexSize.y);

void main() {
// vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 uv = vTexCoord;
  uv.y = 1.0 - uv.y;
  vec3 col = vec3(0.0);

  //vec2 left = vec2(-1.0,0.0) / u_resolution.y;
  float Dx = (texture2D(u_tex0, vTexCoord + tx).r - texture2D(u_tex0, vTexCoord - tx).r) / 2.0;
  float Dy = (texture2D(u_tex0, vTexCoord + ty).r - texture2D(u_tex0, vTexCoord - ty).r) / 2.0;
  vec3 Nx = vec3(tx, Dx);
  vec3 Ny = vec3(ty, Dy);
  
  // vec2 uv_left = uv + left;
  // vec4 tex_left = texture2D(u_tex0, uv_left);
  // vec4 tex = texture2D(u_tex0, uv);
  // vec4 color = max(tex,tex_left);
  col = vec3(Nx);
  gl_FragColor = vec4(col, 1.0);

}