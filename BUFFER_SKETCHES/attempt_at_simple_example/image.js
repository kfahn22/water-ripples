const imageVert = `
#ifdef GL_ES
precision highp float;
#endif

attribute vec3 aPosition;
attribute vec2 aTexCoord;

varying vec2 vTexCoord;

void main() {
  vec4 positionVec4 = vec4(aPosition, 1.0);
  positionVec4.xy = positionVec4.xy * 2.0 - 1.0;
  gl_Position = positionVec4;
  
  vTexCoord = aTexCoord;
  }
`
const imageFrag = `
  #ifdef GL_ES
  precision highp float;
  #endif

  uniform sampler2D uSampler; 
  uniform sampler2D u_tex0; 
  uniform vec2 u_resolution;
  uniform float iTime;
  uniform float iMouse;
  uniform vec2 uTexSize; 
  varying vec2 vTexCoord;
  
  void main()
  {
      vec2 uv = gl_FragCoord.xy / u_resolution.xy;

      // lets calculate normals for distortion
      float nFactor = 10.;
      vec2 step = 2. / u_resolution.xy;
      vec2 xd = vec2( 1., 0.);
      vec2 yd = vec2( 0., 1.);

      float nx = texture2D( uSampler, uv + step * xd ).r - texture( uSampler, uv - step * xd ).r;
      float ny = texture2D( uSampler, uv + step * yd ).r - texture( uSampler, uv - step * yd ).r;
      vec3 normal = normalize(vec3(nx * nFactor, 1., ny * nFactor));

      gl_FragColor = vec4(normal, 1.0);
  }



`