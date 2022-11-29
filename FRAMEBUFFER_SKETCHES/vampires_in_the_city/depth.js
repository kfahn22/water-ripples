const vert = `attribute vec3 aPosition;
  attribute vec3 aNormal;
  attribute vec2 aTexCoord;

  uniform mat4 uModelViewMatrix;
  uniform mat4 uProjectionMatrix;
  uniform mat3 uNormalMatrix;

  varying highp vec2 vVertTexCoord;

  void main(void) {
    vec4 positionVec4 = vec4(aPosition, 1.0);
    gl_Position = uProjectionMatrix * uModelViewMatrix * positionVec4;
    vVertTexCoord = aTexCoord;
  }
`
const frag = `precision mediump float;
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


  void main() {
    float depth = texture2D(uDepth, vVertTexCoord).x;
		
		vec2 coord = gl_FragCoord.xy;
		float noiseOffset = fract(10. * noise(coord * 0.2) + 5. * noise(coord * 1.1)) - 0.5;
		depth = clamp(depth + 0.05*noiseOffset, 0., 1.);
		depth /= 0.8;
		depth += 0.3;
		depth = pow(depth, 1.5);
		
		vec4 darkColor = vec4(0., 0., 0., 1.);
		vec4 lightColor = vec4(1., 1., 1., 1.);
		
		gl_FragColor = mix(darkColor, lightColor, depth);
  }
  `