#ifdef GL_ES
precision highp float;
#endif

// vertex attributes
attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec2 aTexCoord;



uniform sampler2D uSampler;
uniform bool isTexture;
uniform vec2 uTexSize;


varying vec2 vTexCoord;


vec2 tx = vec2(1.0/uTexSize.x, 0.0);
vec2 ty = vec2(0.0, 1.0/uTexSize.y);

void main() {

  vec3 pos = aPosition;

  vec4 tc = texture2D(uSampler, aTexCoord);
  pos.z += tc.r * 1.0;


  float Dx = (texture2D(uSampler, aTexCoord + tx).r - texture2D(uSampler, aTexCoord - tx).r) / 2.0;
  float Dy = (texture2D(uSampler, aTexCoord + ty).r - texture2D(uSampler, aTexCoord - ty).r) / 2.0;

  vec3 Nx = vec3(tx, Dx);
  vec3 Ny = vec3(ty, Dy);
  vec3 normal = cross(Nx, Ny);

  vec4 viewModelPosition = uModelViewMatrix * vec4(pos, 1.0);

  // Pass varyings to fragment shader
  vViewPosition = viewModelPosition.xyz;
  gl_Position = uProjectionMatrix * viewModelPosition;

  vNormal = normalize(uNormalMatrix * normalize(normal));
  vTexCoord = aTexCoord;
}
