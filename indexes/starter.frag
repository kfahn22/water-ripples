//https://www.shadertoy.com/view/WsjcDz
//https://stackoverflow.com/questions/29734341/first-class-array-not-supported


#ifdef GL_ES
precision mediump float;
#endif

// Pass in uniforms from the sketch.js file
uniform vec2 u_resolution; 
uniform float iTime;
uniform vec2 iMouse;
uniform float iFrame;
uniform sampler2D u_tex0;
//uniform sampler2D u_tex1;

varying vec2 vTexCoord;

//uniform float[8] rv
  
#define S smoothstep
#define N 2.
#define n 2
#define RED vec3(255, 0, 0) / 255.


float N21( vec2 p) {
    return fract( sin(p.x*100. + p.y*6574.)*5674. );
}

// vec4[8] Get8Neighbours(sampler2D sampler)
// {
//     int i = 0;
//     vec2 at;
//     vec4[8] ret;
//     vec2 step = vec2(1.0) / uResolution.x;
//     for(float x = -1.0; x < 2.0; x++)
//     {
//         for(float y = -1.0; y < 2.0; y++)
//         {
//             if(x != 0.0 || y != 0.0)
//             {
//                 at = vec2(x,y);
//                 ret[i] = texture2D(sampler, vTexCoord + (at * step));
//                 i++;
//             }
//         }
//     }
//     return ret;
// }

float Get8Neighbours(sampler2D sampler, vec2 uv)
{
    vec2 at;
    vec4 val;
    float sum = 0.0;
   // boolean alive;
    vec2 step = vec2(1.0) / u_resolution.xy;
    for(float x = -1.0; x < 2.0; x++)
    {
        for(float y = -1.0; y < 2.0; y++)
        {
            if(x != 0.0 || y != 0.0)
            {
                at = vec2(x,y);
                //val = texture2D(sampler, uv);
                val = texture2D(sampler, vTexCoord + at * step);
                if (val.r > 0.5) {
                    sum += 1.0;
                }
                //val = min(val, val1);
                // vec4 val2 = texture2D(sampler, vTexCoord - (at * step));
            }
        }
    }
    return sum;
}

void main()
{
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
   // vec2 uv = vTexCoord;
    uv *= vec2(n,n);
    uv.y = 1.0 - uv.y;
    vec3 col;
    
    //uv *= vec2(4,4);

    // vec2   cell =     floor(uv),
    //          xy = 2.* fract(uv) -1.;
    // float index = cell.x + 4.* cell.y,
    //        time = xy.x + iTime,
    //         pct = sin(3.1415926 * index * time),
    //           v = xy.y - .5*pct;
   //vec4 val = Get8Neighbours( u_tex0, uv );
   float sum = Get8Neighbours( u_tex0, uv );
   if (sum == 1.0) {
       col = vec3(1.0, 0.2, 1.0);
   }
   //gl_FragColor = val;
   gl_FragColor = vec4( col, 1.0);
}