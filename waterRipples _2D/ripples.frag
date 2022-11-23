#ifdef GL_ES
precision highp float;
#endif

#define TURQUOISE vec3(11,106,136)/255.

uniform sampler2D uSampler;

varying vec2 vTexCoord;

vec2 tx = vec2(1.0/uTexSize.x, 0.0);

void main() {
  vec2 uv = vTexCoord.xy;
  vec3 col = TURQUOISE;
  
  float dx = (texture2D(uSampler, aTexCoord + tx).r - texture2D(uSampler, aTexCoord - tx).r) / 2.0;

  vec3 nx = vec3(tx, dx);
 
  vec3 col = vec3(Nx,1.0,1.0);
 
  gl_FragColor = vec4(col, 1.0);
}