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

// Arrays are allowed as arguments, but not as the return type. When arrays are declared as formal parameters, their size must be included. An array is passed to a function by using the array name without any subscripting or brackets, and the size of the array argument passed in must match the size specified in the formal parameter declaration.
// float f[32] = float[32]( 2.,1000.,3.,4.,5., 6.,7.,8.,9.,11.,12.,150.,99.,
//                      40.,1.,10000.,2.,1100.,12.,100.,1000.,400.,210.,112.,113.,131.,
//                      1300.,110.,1139.,1108.,1313.,1.);

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

vec4 Get8Neighbours(sampler2D sampler, vec2 uv)
{
    vec2 at;
    vec4 val;
   // boolean alive;
    vec2 step = vec2(1.0) / u_resolution.x;
    for(float x = -1.0; x < 2.0; x++)
    {
        for(float y = -1.0; y < 2.0; y++)
        {
            if(x != 0.0 || y != 0.0)
            {
                at = vec2(x,y);
                //val = texture2D(sampler, vTexCoord);
              val = texture2D(sampler, uv);
                vec4 val1 = texture2D(sampler, vTexCoord + (vec2(-1., 0.) * step));
                val = min(val, val1);
                // vec4 val2 = texture2D(sampler, vTexCoord - (at * step));
                // val = max(val, val2);
            }
        }
    }
    return val;
}

void main()
{
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
   // vec2 uv = vTexCoord;
    uv *= vec2(4,4);
    uv.y = 1.0 - uv.y;
    
    //uv *= vec2(4,4);

    // vec2   cell =     floor(uv),
    //          xy = 2.* fract(uv) -1.;
    // float index = cell.x + 4.* cell.y,
    //        time = xy.x + iTime,
    //         pct = sin(3.1415926 * index * time),
    //           v = xy.y - .5*pct;
    vec4 val = Get8Neighbours( u_tex0, uv );
   gl_FragColor = val;
  //gl_FragColor = vec4( 1. - abs(v));
}