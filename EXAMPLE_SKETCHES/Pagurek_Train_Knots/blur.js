const vert = `precision highp float;
	attribute vec3 aPosition;
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
const frag = `precision highp float;
  varying highp vec2 vVertTexCoord;

  uniform sampler2D uImg;
  uniform sampler2D uDepth;
  uniform vec2 uSize;
  uniform float uIntensity;
  uniform int uNumSamples;
  uniform float uTargetZ;
  uniform float uNear;
  uniform float uFar;

  const int MAX_NUM_SAMPLES = 50;

  float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
  }

  float depthToZ(float depth) {
    float depthNormalized = 2.0 * depth - 1.0;
    return 2.0 * uNear * uFar / (uFar + uNear - depthNormalized * (uFar - uNear));
  }

  float calcBlur(float z, float pixelScale) {
    return clamp(abs(z - uTargetZ), 0.0, 0.5*pixelScale);
  }

  void main() {
    float pixelScale = max(uSize.x, uSize.y);
    float total = 1.0;
    float origZ = depthToZ(texture2D(uDepth, vVertTexCoord).x);
    vec4 color = texture2D(uImg, vVertTexCoord);
    float blurAmt = calcBlur(origZ, pixelScale);
    for (int i = 0; i < MAX_NUM_SAMPLES; i++) {
      if (i >= uNumSamples) break;
      float t = (float(i + 1) / float(uNumSamples));
      float angle = (t*4.0) * ${2 * Math.PI};
      float radius = 1.0 - (t*t*t); // Sample more on the outer edge
      angle += 1.*rand(gl_FragCoord.xy);
      vec2 offset = (vec2(cos(angle),sin(angle)) * radius * uIntensity * blurAmt)/pixelScale;
      float z = depthToZ(texture2D(uDepth, vVertTexCoord + offset).x);
      float sampleBlur = calcBlur(z, pixelScale);

      float weight = float((z >= origZ) || (sampleBlur >= blurAmt*radius + 5.));
			vec4 sample = texture2D(uImg, vVertTexCoord + offset);
      color += weight * sample;
      total += weight;
    }
    color /= total;
		gl_FragColor = color;
  }
  `