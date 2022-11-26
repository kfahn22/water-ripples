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
const imageFrag = `precision mediump float;
  varying highp vec2 vVertTexCoord;

  uniform sampler2D uImg;
  uniform sampler2D uDepth;
  uniform vec2 uSize;

  // Noise functions
  // https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83
  float rand(float n) {
    return fract(sin(n) * 43758.5453123);
  }
  float rand(vec2 n) { 
    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
  }
  float noise(float p) {
    float fl = floor(p);
    float fc = fract(p);
    return mix(rand(fl), rand(fl + 1.0), fc);
  }
  float noise(vec2 n) {
    const vec2 d = vec2(0.0, 1.0);
    vec2 b = floor(n);
    vec2 f = smoothstep(vec2(0.0), vec2(1.0), fract(n));
    return mix(mix(rand(b), rand(b + d.yx), f.x), mix(rand(b + d.xy), rand(b + d.yy), f.x), f.y);
  }
  ifdef GL_ES
  precision highp float;
  #endif
  
  uniform sampler2D uSampler; // texture from sketchB
  uniform sampler2D u_tex0; // texture from image
  uniform vec2 u_resolution;
  uniform float iTime;
  uniform float iMouse;
  uniform vec2 uTexSize; 
  varying vec2 vTexCoord;
  
  void main()
  {
    //vec2 uv = gl_FragCoord.xy / u_resolution.xy;
      vec2 uv = vTexCoord.xy;
      vec4 col = texture2D(u_tex0, uv);
      vec2 step = 1. / u_resolution.xy;
      
      vec4 n = texture2D( uSampler, uv + step * vec2( 0., 1.) );
      vec4 s = texture2D( uSampler, uv + step * vec2( 0., -1.) );
      vec4 e = texture2D( uSampler, uv + step * vec2( 1., 0.) );
      vec4 w = texture2D( uSampler, uv + step * vec2( -1., 0.) );
  
      // water logic
      // https://web.archive.org/web/20080618181901/http://freespace.virgin.net/hugo.elias/graphics/x_water.htm
    float viscosityConstant = 0.997;
      float damping = 0.997;
      float newHeight = ( ( n.r + s.r + e.r + w.r ) * 0.5 - col.g ) * viscosityConstant;
    newHeight *= damping;
      
      //add mouse effect
      float mouseDist = length(iMouse.xy / u_resolution.xy - uv);
      if ( mouseDist < length(step*7.) ) {
        newHeight += 0.006 + 0.002 * sin(iTime) + 0.001 * sin(gl_FragCoord.x*0.3 + gl_FragCoord.y*0.05);
      }
      newHeight = clamp(newHeight, 0., 1.);
      
      
      // // add noise
      // float noiseUvScale = 0.2;
      // float noise1 = texture2D( iChannel1, uv * noiseUvScale + vec2(0.02, 0.02)*iTime).r;
      // float noise2 = texture2D( iChannel1, uv * noiseUvScale*0.4 - vec2(0.011, 0.05) * iTime).r;
      // float noise3 = texture2D( iChannel1, uv * noiseUvScale*1.3 + vec2(0.035, -0.04) * iTime).r;
      // float noiseCombo = (noise1 + noise2 + noise3) / 6.;
      // newHeight += noiseCombo * 0.0002;
      
      // simulate buffer swapping with channels r,g
      vec3 finalColor = vec3(0.);
      finalColor.g = col.r;
      finalColor.r = newHeight;
      gl_FragColor = vec4(finalColor, 1.);
  }



`

  // void main() {
  //   float depth = texture2D(uDepth, vVertTexCoord).x;
		
	// 	vec2 coord = gl_FragCoord.xy;
	// 	float noiseOffset = fract(10. * noise(coord * 0.2) + 5. * noise(coord * 1.1)) - 0.5;
	// 	depth = clamp(depth + 0.05*noiseOffset, 0., 1.);
	// 	depth /= 0.8;
	// 	depth += 0.3;
	// 	depth = pow(depth, 1.5);
		
	// 	vec4 darkColor = vec4(0., 0., 0., 1.);
	// 	vec4 lightColor = vec4(1., 1., 1., 1.);
		
	// 	gl_FragColor = mix(darkColor, lightColor, depth);
  // }
  // `