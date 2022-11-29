//https://www.shadertoy.com/view/4tVfzh

#define NEIGH_CHAN iChannel2
#define SELF_CHAN  iChannel1
#define INIT_CHAN iChannel3
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{


   vec4 cell = texture(SELF_CHAN,fragCoord/iResolution.xy);
   if ( iMouse.z < 1.0) {
       
    /* From https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life :
Any live cell with fewer than two live neighbors dies, as if by underpopulation.
Any live cell with two or three live neighbors lives on to the next generation.
Any live cell with more than three live neighbors dies, as if by overpopulation.
Any dead cell with exactly three live neighbors becomes a live cell, as if by reproduction.
    */
      vec4 neighbours = texture(NEIGH_CHAN,fragCoord/iResolution.xy) * 8.0;   

      if (cell.y > 0.5) {
        // Cell alive
        if (neighbours.y > 1.1 && neighbours.y < 3.3) {
           fragColor = vec4(1.0);
        }
        else {
           fragColor = vec4(0.0,0.0,0.0,1.0);
        }
      } else {
        // Cell currently dead
        if (neighbours.y > 2.5 && neighbours.y < 3.5) {
            fragColor =  vec4(1.0);
        } else {
            fragColor = vec4(0.0);
        }
      }
  } else { 
       fragColor=cell + ( 1.0-step(1.0,abs(distance(fragCoord,iMouse.xy))));
  }

  if (iFrame < 120) {
    fragColor = vec4(length(fwidth(step(0.5,texture(INIT_CHAN, fragCoord/iResolution.xy)))));
  }
}