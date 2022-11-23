#ifdef GL_ES
precision highp float;
#endif

#define AQUA vec3(45,197,244)/255.

uniform sampler2D uSampler;
//uniform sampler2D u_tex0;

varying vec2 vTexCoord;

vec2 tx = vec2(1.0/uTexSize.x, 0.0);
//vec2 ty = vec2(0.0, 1.0/uTexSize.y);

void main() {
  vec2 uv = vTexCoord.xy;
  vec3 col = AQUA;
  //uv.y = 1.0 - uv.y;
  float dx = (texture2D(uSampler, aTexCoord + tx).r - texture2D(uSampler, aTexCoord - tx).r) / 2.0;
  //float Dy = (texture2D(uSampler, aTexCoord + ty).r - texture2D(uSampler, aTexCoord - ty).r) / 2.0;

  vec3 nx = vec3(tx, dx);
  //vec3 Ny = vec3(ty, Dy);
  //vec3 col = vec3(Nx,0.05,0.05);
  vec3 col += nx;
  gl_FragColor = vec4(col, 1.0);
}