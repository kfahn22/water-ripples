// 2D Water Ripples
// The Coding Train / Daniel Shiffman
// https://thecodingtrain.com/CodingChallenges/102-2d-water-ripple.html
// https://youtu.be/BZUdGqeOD0w
// https://editor.p5js.org/codingtrain/sketches/tYXtzNSl

// Algorithm: https://web.archive.org/web/20160418004149/http://freespace.virgin.net/hugo.elias/graphics/x_water.htm

// From Riff Bear in comments on youTube
// took me a solid minute, but found out one way to add rgb with the line:

// pixels[index] = color(current[i][j]*r, current[i][j]*g, current[i][j]*b);

// just declaring and setting r, g, b to what you want. With the updated mouse press line, this code example is very cool and looks sweet! Cheers!

// edit* and found out you can have it change color s it moves by adding above the updatePixels line:

//   if ( r == 254 ) {
//   z = z*(-1);
//   }
//   r = r + z;
//   b = b - z;
//   if ( r == 0 ) {
//   z = z*(-1);
//   }

// and just declare z as 1. This will switch the wave from blue to red and back.

// edit 2* I cant stop playing with this AHHH haha. Found out if you change the divide by 2 when adding up all the previous points, to a divide by like sqrt(9999999) you get a really cool flickering stars effect. like perfect flickering stars, especially with a rotating color from like white to yellow. very awesome!


// Simon Tyler
// A nice example - but the numerics bugged me because it looked so close to a numerical derivative! It turns out it actually is just the naive central difference approximation to the 2D wave equation on a square lattice, but with a very special choice of wave speed and/or step size. Here's a derivation with a unit time and space step size:

// Use central difference to get discrete version of wave equation for ripple height H:  
// d_tt H = c^2 (d_xx + d_yy) H
// H_{x,y,t-1} - 2 H_{x,y,t} + H_{x,y,t+1} = c^2 (H_{x-1,y,t} - 2 H_{x,y,t} + H_{x+1,y,t} + H_{x,y-1,t} - 2 H_{x,y,t} + H_{x,y+1,t})
// H_{x,y,t+1} = c^2 (H_{x-1,y,t} + H_{x+1,y,t} + H_{x,y-1,t} + H_{x,y+1,t}) + (2 - 4 c^2) H_{x,y,t} - H_{x,y,t-1}
// If c^2 = 0.5 then you get the nice simplification that is used in this video
// H_{x,y,t+1} = 0.5 * (H_{x-1,y,t} + H_{x+1,y,t} + H_{x,y-1,t} + H_{x,y+1,t}) - H_{x,y,t-1}

let cols;
let rows;
let current; // = new float[cols][rows];
let previous; // = new float[cols][rows];

// let current = new Array();
// let previous = new Array();
let dampening = 0.99;
//let dampening = 0.99;

let colors = [
  [45,197,244],// background
  [146,83,161],
  [248,158,79],
  [236,1,90]
];

// // colors for aqua
let r = 44;
let g = 197;
let b = 244;

// colors for magenta
// let r = 164;
// let g = 41;
// let b = 99;

function setup() {
  pixelDensity(1);
  createCanvas(800, 450);
  cols = width;
  rows = height;
  // The following line initializes a 2D cols-by-rows array with zeroes
  // in every array cell, and is equivalent to this Processing line:
  // current = new float[cols][rows];
  current = new Array(cols).fill(0).map(n => new Array(rows).fill(0));
  previous = new Array(cols).fill(0).map(n => new Array(rows).fill(0));
 
  
   for (let i = 0; i < cols; i++) {
      current[i] = [];
      previous[i] = [];
      for (let j = 0; j < rows; j++) {
        current[i][j] = 0;
        previous[i][j] = 0;
      }
    }
    //previous[100][100] = 255
    previous[400][225] = 255;
}

function mousePressed() {
 save('water.jpg');
}

function mouseDragged() {
 previous[mouseX][mouseY] = 500;
//   previous[mouseX][mouseY] = 
//    color([mouseX][mouseY]*r, [mouseX][mouseY]*g, [mouseX][mouseY]*b);
 
}

function draw() {
  
  background(0);
  loadPixels();
  //dividsor 2
  for (let i = 1; i < cols - 1; i++) {
    for (let j = 1; j < rows - 1; j++) {
      current[i][j] =
        (previous[i - 1][j] +
          previous[i + 1][j] +
          previous[i][j - 1] +
          previous[i][j + 1]) /
          2 -
        1.02*current[i][j];
      
    
      
      current[i][j] = current[i][j] * dampening;
      // Unlike in Processing, the pixels array in p5.js has 4 entries
      // for each pixel, so we have to multiply the index by 4 and then
      // set the entries for each color component separately.
      let index = (i + j * cols) * 4;
      
     
     //pixels[index] = color(current[i][j]*r, current[i][j]*g, current[i][j]*b);
      pixels[index + 0] = r + current[i][j];
      pixels[index + 1] = g + current[i][j];
      pixels[index + 2] = b + current[i][j];
    }
  }
  
  updatePixels();

  let temp = previous;
  previous = current;
  current = temp;
}