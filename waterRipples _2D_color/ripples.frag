// Code for normals from:
// https://www.shadertoy.com/view/WtsyzS

#ifdef GL_ES
precision highp float;
#endif

uniform sampler2D uSampler;
uniform sampler2D u_tex0;
uniform vec2 u_resolution;
varying vec2 vTexCoord;

void main() {
  vec2 uv = vTexCoord.xy;
  vec2 st =  (2.0*gl_FragCoord.xy-u_resolution.xy)/u_resolution.y;
  vec2 tx = vec2(1.0, 0.0);
  //vec2 ty = vec2(0.0, 1.0);
  vec3 col;
  vec3 imgTex = texture2D(u_tex0, st).rgb;
  
  float dx = (texture2D(uSampler, vTexCoord + tx).r - texture2D(uSampler, vTexCoord - tx).r) / 2.0;
  //float cy = (texture2D(uSampler, vTexCoord + ty).g - texture2D(uSampler, vTexCoord - ty).g) / 2.0;
  vec3 nx = clamp(vec3(tx, dx), vec3(0.0), vec3(1.0));
  col += nx;
// simulate buffer swapping with channels r,g
    // vec3 finalColor = vec3(0.);
    // finalColor.g = col.r;
    // finalColor.r = nx;
    //col = col1.rgb;
    gl_FragColor = vec4(col, 1.0);
 // gl_FragColor = vec4(col, 1.0);
}