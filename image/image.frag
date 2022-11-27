#ifdef GL_ES
precision highp float;
#endif

uniform vec2 u_resolution; 
uniform float iTime;
uniform vec2 iMouse;
uniform float iFrame;
uniform sampler2D u_tex0;
varying vec2 vTexCoord;

vec4 Get8Neighbours(sampler2D sampler, vec2 uv)
{
    vec2 at;
    vec4 val;
    vec2 step = vec2(1.0) / u_resolution.xy;
    for(float x = -1.0; x < 2.0; x++)
    {
        for(float y = -1.0; y < 2.0; y++)
        {
            if(x != 0.0 || y != 0.0)
            {
              at = vec2(x,y);
              val = texture2D(sampler, uv);
            }
        }
    }
    return val;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  float n = 1;

  uv *= vec2(n,n);
  uv.y = 1.0 - uv.y;
  // vec3 col=vec3(0); 
  vec4 imgTex = texture2D(u_tex0, uv);
  //vec4 imgTex = Get8Neighbours( u_tex0, uv );
  
  gl_FragColor = imgTex;
}