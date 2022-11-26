#ifdef GL_ES
precision highp float;
#endif

uniform vec2 u_resolution;
uniform sampler2D u_tex0;
//uniform sampler2D u_tex1;

varying vec2 vTexCoord;

void main() {
  
  // vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 uv = vTexCoord.xy;
  uv.y = 1.0 - uv.y;
  
  vec4 col = texture2D(u_tex0, uv);
  vec2 step = 1. / u_resolution.xy;
    
  vec4 n = texture2D( u_tex0, uv + step * vec2( 0., 1.) );
  vec4 s = texture2D( u_tex0, uv + step * vec2( 0., -1.) );
  vec4 e = texture2D( u_tex0, uv + step * vec2( 1., 0.) );
  vec4 w = texture2D( u_tex0, uv + step * vec2( -1., 0.) );

  // water logic
  // https://web.archive.org/web/20080618181901/http://freespace.virgin.net/hugo.elias/graphics/x_water.htm
	float viscosityConstant = 0.997;
    float damping = 0.997;
    float tex = ( ( n.r + s.r + e.r + w.r ) * 0.5 - col.g ) * viscosityConstant;

  col = vec3(tex);
  gl_FragColor = vec4(col, 1.0)
}


