#ifdef GL_ES
precision highp float;
#endif

uniform vec2 u_resolution;
uniform sampler2D u_tex0;
uniform sampler2D u_tex1;

varying vec2 vTexCoord;

void main() {
  
  // vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 uv = vTexCoord;
  uv.y = 1.0 - uv.y;
  

  vec2 left = vec2(-1.0,0.0) / u_resolution.xy;
  vec2 uv_left = uv + left;
  vec4 tex_left = texture2D(u_tex0, uv_left);
  vec4 tex = texture2D(u_tex0, uv);
  vec4 color = max(tex,tex_left);
  gl_FragColor = color;
}


