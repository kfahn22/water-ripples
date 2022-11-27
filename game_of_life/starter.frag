// Ported to P5.js from "RayMarching starting point" 
// by Martijn Steinrucken aka The Art of Code/BigWings - 2020
// The MIT License
// YouTube: youtube.com/TheArtOfCodeIsCool

#ifdef GL_ES
precision mediump float;
#endif

// Pass in uniforms from the sketch.js file
uniform vec2 u_resolution; 
uniform float iTime;
uniform vec2 iMouse;
uniform float iFrame;
uniform sampler2D u_tex0;
uniform sampler2D uSampler;
varying vec2 vTexCoord;

#define S smoothstep

float N21( vec2 p) {
    return fract( sin(p.x*100. + p.y*6574.)*5674. );
}

float remap01(float a, float b, float t)
{
 return (t-a) / (b-a);
}

float remap(float a, float b, float c, float d, float  t)
{

  return remap01(a,b,t) * (d-c) + c;
}


float GetNeighbors(sampler2D uSampler, vec2 p) {
  float num = 0.;
  for (float y = -1.; y <=1.; y ++) {
    for (float x = -1.; x <=1.; x ++) {
      vec2 tx = vec2(x,y);
      if (x==0. && y==0.) continue;
      float val = texture2D(uSampler, p + tx).r;
      if ( val > 0.5 ) {
        num += 1.0;
      }
  }
 }
  return num;
}

void main( )
{
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 st = vTexCoord.xy;
  float t =  iTime;
  vec3 col = vec3(0);
  bool alive;
      if (iFrame < 40.0) { // initialize
         col = texture2D(u_tex0, uv).rgb;
       } else {
        float num = GetNeighbors(uv);
        if (texture2D(u_tex0, uv).r > 0.75) {
             alive = true;
        }
        float next = 0.0;
        if (alive && (num==2.0 || num==3.0))
          next = 1.0;
        else {
          next = 0.0;
        }  
        col = vec3(next);
     }
    vec4 col = texture2D(u_tex0, uv);
    gl_FragColor = col;
    //gl_FragColor = vec4(col, 1.0);
}
