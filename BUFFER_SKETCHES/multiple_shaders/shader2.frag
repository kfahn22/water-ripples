#ifdef GL_ES
precision highp float;
#endif

uniform vec2 u_resolution;
uniform sampler2D u_tex0;
uniform sampler2D uSampler;
uniform vec2 iMouse;
uniform float iTime;

//uniform sampler2D u_tex1;

varying vec2 vTexCoord;

#define S smoothstep
#define PURPLE vec3(146,83,161)/255.

vec4 Ripples(sampler2D uSampler, vec2 uv )
{
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    vec4 col = texture2D(u_tex0, uv);
    vec2 step = 1. / u_resolution.xy;
    
    // vec4 n = texture2D( uSampler, uv + step * vec2( 0., 1.) );
    // vec4 s = texture2D( uSampler, uv + step * vec2( 0., -1.) );
    // vec4 e = texture2D( uSampler, uv + step * vec2( 1., 0.) );
    // vec4 w = texture2D( uSampler, uv + step * vec2( -1., 0.) );

    vec4 n = texture2D( u_tex0, uv + step * vec2( 0., 1.) );
    vec4 s = texture2D( u_tex0, uv + step * vec2( 0., -1.) );
    vec4 e = texture2D( u_tex0, uv + step * vec2( 1., 0.) );
    vec4 w = texture2D( u_tex0, uv + step * vec2( -1., 0.) );

    // water logic
    // https://web.archive.org/web/20080618181901/http://freespace.virgin.net/hugo.elias/graphics/x_water.htm
	 float viscosityConstant = 0.997;
    float damping = 0.997;
    //float newHeight = ( ( n.r + s.r + e.r + w.r ) * 0.5 - col.r ) * viscosityConstant;
    float newHeight = ( ( n.r + s.r + e.r + w.r ) * 0.5 - col.g ) * viscosityConstant;
	  newHeight *= damping;

    //add mouse effect
    float mouseDist = length(iMouse.xy / u_resolution.xy - uv);
    if (mouseDist < length(step*7.))
    {
    	newHeight += 0.006 + 0.002 * sin(iTime) + 0.001 * sin(gl_FragCoord.x*0.3 + gl_FragCoord.y*0.05);
    }
    newHeight = clamp(newHeight, 0., 1.);
    
    
    // add noise
    // float noiseUvScale = 0.2;
    // float noise1 = texture2D( uSampler, uv * noiseUvScale + vec2(0.02, 0.02)*iTime).r;
    // float noise2 = texture2D( uSampler, uv * noiseUvScale*0.4 - vec2(0.011, 0.05) * iTime).r;
    // float noise3 = texture2D( uSampler, uv * noiseUvScale*1.3 + vec2(0.035, -0.04) * iTime).r;
    // float noiseCombo = (noise1 + noise2 + noise3) / 6.;
    // newHeight += noiseCombo * 0.0002;
    
    // simulate buffer swapping with channels r,g
    vec3 finalColor = vec3(0.0);
    finalColor.g = col.r;
    finalColor.r = newHeight;
  //return newHeight;
 return vec4(finalColor, 1.0);
  }

float sdCircle( vec2 p, float r )
{
    return length(p) - r;
}

float sdBox( in vec2 p, in vec2 b )
{
    vec2 d = abs(p)-b;
    return length(max(d,0.0)) + min(max(d.x,d.y),0.0);
}

void main() {
  //vec2 uv =(2.0 * gl_FragCoord.xy - u_resolution.xy) / u_resolution.y;
  vec3 col = vec3(0.0);
  vec2 uv = vTexCoord * 2.0 ;
  uv.y = 1.0 - uv.y;
  float d = sdCircle( uv - vec2(0.4, 0.0), 0.05);
  float m = S(0.008, 0.0, d);
  col += m*PURPLE;
  gl_FragColor = vec4(col, 1.0);
}