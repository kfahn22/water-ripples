// A has input B
// copied from https://www.shadertoy.com/view/WtsyzS

#ifdef GL_ES
precision highp float;
#endif

uniform sampler2D uSampler;
uniform float iTime;
varying vec2 vTexCoord;

void main()
{
    vec2 uv = gl_FragCoord/u_resolution.xy;
    vec2 centered = (uv - vec2(0.5)) * 2.;	// center to (-1 1)
    vec4 col = 2Dtexture(uSampler, uv);
    vec4 finalColor = col;
    
    
    // initial behavior, just to get smth started.
    float timing = mod(iTime, 60.0) / 60.0;
    if (timing >= 0.995 && timing <= 1.0) {
    

        float angle = atan(centered.y, centered.x);
        float mask = (1. - step(length(9. * centered), 0.6)) * step(length(9. * centered), 1.5);

        float defaultHeight = 0.0;
		float ringHeight = 0.03;
        
        
        vec3 water = clamp(mix(vec3(defaultHeight, 0., 0.), vec3(ringHeight, 0., 0.), mask), vec3(0.), vec3(1.));
        finalColor = vec4(water, col.a);
        

    } else {
        
        // else just pass the buffer on to B.
        finalColor = col;
        
    }
    
    
    gl_FragColor = finalColor;
}