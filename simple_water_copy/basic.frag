// https://www.shadertoy.com/view/WtsyzS
// has two buffers


//image has input B, stoneTexture
void main( )
{  
	vec2 uv = gl_FragCoord.xy / u_resolution.xy;

    // lets calculate normals for distortion
    float nFactor = 10.;
    vec2 step = 2. / u_resolution.xy;
    vec2 xd = vec2( 1., 0.);
    vec2 yd = vec2( 0., 1.);
	float nx = texture2D( iChannel0, uv + step * xd ).r - texture2D( iChannel0, uv - step * xd ).r;
    float ny = texture2D( iChannel0, uv + step * yd ).r - texture2D( iChannel0, uv - step * yd ).r;
    vec3 normal = normalize(vec3(nx * nFactor, 1., ny * nFactor));
    
    // blur the image a bit
    vec3 n = texture2D( iChannel1, uv + normal.xz + step * vec2( 0., 1.) ).rgb;
    vec3 s = texture2D( iChannel1, uv + normal.xz + step * vec2( 0., -1.) ).rgb;
    vec3 e = texture2D( iChannel1, uv + normal.xz + step * vec2( 1., 0.) ).rgb;
    vec3 w = texture2D( iChannel1, uv + normal.xz + step * vec2( -1., 0.) ).rgb;
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
