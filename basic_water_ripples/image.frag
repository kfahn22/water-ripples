//copied from https://www.shadertoy.com/view/WtsyzS
//image has input B (ichannel), stoneTexture (ichannelB)

#ifdef GL_ES
precision highp float;
#endif

uniform sampler2D uSamplerA; // texture from sketchA
uniform sampler2D uSamplerB; // texture from sketchB
uniform float iTime;
uniform float iMouse;
uniform vec2 u_tex0; // texture from image
varying vec2 vTexCoord;

vec3 waterLogic( vec2 uSampler vec2 uv) {
    vec4 n = texture2D( uSamplerA, uv + step * vec2( 0., 1.) );
    vec4 s = texture2D( uSamplerA, uv + step * vec2( 0., -1.) );
    vec4 e = texture2D( uSamplerA, uv + step * vec2( 1., 0.) );
    vec4 w = texture2D( uSamplerA, uv + step * vec2( -1., 0.) );

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
    newHeight =  clamp(newHeight, 0., 1.);

    // add noise
    float noiseUvScale = 0.2;
    float noise1 = texture( u_tex0, uv * noiseUvScale + vec2(0.02, 0.02)*iTime).r;
    float noise2 = texture( u_tex0, uv * noiseUvScale*0.4 - vec2(0.011, 0.05) * iTime).r;
    float noise3 = texture( u_tex0, uv * noiseUvScale*1.3 + vec2(0.035, -0.04) * iTime).r;
    float noiseCombo = (noise1 + noise2 + noise3) / 6.;
    newHeight += noiseCombo * 0.0002;

    // simulate buffer swapping with channels r,g
    vec3 finalColor = vec3(0.);
    finalColor.g = col.r;
    finalColor.r = newHeight;
    return finalColor;
}


void main()
{  
	vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    //vec2 uv = vTexCoord.xy;
    // lets calculate normals for distortion
    float nFactor = 10.;
    vec2 step = 2. / u_resolution.xy;
    vec2 xd = vec2( 1., 0.);
    vec2 yd = vec2( 0., 1.);
	float nx = texture2D( uSampler, uv + step * xd ).r - texture( iChannel0, uv - step * xd ).r;
    float ny = texture2D( uSampler, uv + step * yd ).r - texture( iChannel0, uv - step * yd ).r;
    vec3 normal = normalize(vec3(nx * nFactor, 1., ny * nFactor));
    
    // blur the image a bit
    vec3 n = texture2D( u_tex0, uv + normal.xz + step * vec2( 0., 1.) ).rgb;
    vec3 s = texture2D( u_tex0, uv + normal.xz + step * vec2( 0., -1.) ).rgb;
    vec3 e = texture2D( u_tex0, uv + normal.xz + step * vec2( 1., 0.) ).rgb;
    vec3 w = texture2D( u_tex0, uv + normal.xz + step * vec2( -1., 0.) ).rgb;
    vec3 finalColor = (n + s + e + w) / 4.;
    
    // add some pseudo specular lighting
    float fovFakeFactor = 5.;
    vec3 inverseLightDir = normalize(vec3(2., 1., 1.4));
    vec3 inverseViewDir = normalize(vec3(0., 1., 0.) + vec3(uv.x, 0., uv.y) * fovFakeFactor);
    vec3 lightColor = vec3(1.);
    vec3 halfwayDir = normalize(inverseLightDir + inverseViewDir);
    float spec = pow(max(dot(normal, halfwayDir), 0.0), 4.);
	vec3 specular = lightColor * spec;
	finalColor += specular * 2.;
    
    // add a little brightness based on height of water
    float waterHeight = texture( iChannel0, uv).r;
    float brightness = clamp(waterHeight*10., 0., 0.1);
    finalColor += vec3(brightness);
    
    gl_FragColor = vec4(finalColor, 1.);
}

