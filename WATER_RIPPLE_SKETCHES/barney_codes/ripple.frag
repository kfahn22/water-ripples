#ifdef GL_ES
precision mediump float;
#endif

varying vec2 pos;

uniform vec2 res;
uniform sampler2D currBuff;
uniform sampler2D prevBuff;
uniform float damping;


void main() {
  // calculate pixel size
  vec2 pix = 1.0/res;
  
  // get water state
  float prev = texture2D(prevBuff, pos).r;
  
  // get previous neighbour water states
  float u = texture2D(currBuff, pos + vec2(0.0, pix.y)).r;
  float d = texture2D(currBuff, pos - vec2(0.0, pix.y)).r;
  float l = texture2D(currBuff, pos + vec2(pix.x, 0.0)).r;
  float r = texture2D(currBuff, pos - vec2(pix.x, 0.0)).r;

  // calculate the next state value
  float next = ((u + d + l + r)/2.0) - prev;
  next = next * damping;

  // output next state value
  gl_FragColor = vec4(next, next/2.0 + 0.5, 1.0, 1.0);
}

