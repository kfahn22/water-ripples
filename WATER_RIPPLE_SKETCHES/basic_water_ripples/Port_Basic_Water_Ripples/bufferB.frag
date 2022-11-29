// ported from https://www.shadertoy.com/view/WtsyzS
// B has input A, noise(64x64, repeat)

#ifdef GL_ES
precision highp float;
#endif

uniform sampler2D uSampler; // input from buffer A 
varying vec2 vTexCoord;

void main()
{
	vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec4 col = texture2D(iChannel0, uv);
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
    if (mouseDist < length(step*7.) && iMouse.z > 0.) {
    	newHeight += 0.006 + 0.002 * sin(iTime) + 0.001 * sin(fragCoord.x*0.3 + fragCoord.y*0.05);
    }
    newHeight = clamp(newHeight, 0., 1.);
    
    
    // add noise
    float noiseUvScale = 0.2;
    float noise1 = texture( iChannel1, uv * noiseUvScale + vec2(0.02, 0.02)*iTime).r;
    float noise2 = texture( iChannel1, uv * noiseUvScale*0.4 - vec2(0.011, 0.05) * iTime).r;
    float noise3 = texture( iChannel1, uv * noiseUvScale*1.3 + vec2(0.035, -0.04) * iTime).r;
    float noiseCombo = (noise1 + noise2 + noise3) / 6.;
    newHeight += noiseCombo * 0.0002;
    
    // simulate buffer swapping with channels r,g
    vec3 finalColor = vec3(0.);
    finalColor.g = col.r;
    finalColor.r = newHeight;
    gl_FragColor = vec4(finalColor, 1.);
}