#ifdef GL_ES
precision highp float;
#endif

uniform sampler2D uSampler;
varying vec2 vTexCoord;

void main() {
  vec2 uv = vTexCoord.xy;
  vec2 step = 2. / u_resolution.xy;
  vec2 tx = vec2(1.0, 0.2);
  vec2 ty = vec2(0.0, 1.0);
  vec3 col = vec3(0.0);
  
  float nx = (texture2D(uSampler, vTexCoord + tx).r - texture2D(uSampler, vTexCoord - tx).r) / 2.0;
  float ny = (texture2D(uSampler, vTexCoord + ty).g - texture2D(uSampler, vTexCoord - ty).g) / 2.0;
  vec3 normal = normalize(vec3(nx * nFactor, 1., ny * nFactor));
   // blur the image a bit
    vec3 n = texture2D( uSampler, uv + normal.xz + step * vec2( 0., 1.) ).rgb;
    vec3 s = texture2D( uSampler, uv + normal.xz + step * vec2( 0., -1.) ).rgb;
    vec3 e = texture2D( uSampler, uv + normal.xz + step * vec2( 1., 0.) ).rgb;
    vec3 w = texture2D( uSampler, uv + normal.xz + step * vec2( -1., 0.) ).rgb;
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

  vec3 nx = vec3(tx, dx);
  vec3 ny = vec3(ty, dy);
  vec3 nmix = mix(nx, ny, 0.5);
  col = nx;
  gl_FragColor = vec4(finalColor, 1.0);
}