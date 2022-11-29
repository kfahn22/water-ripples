let draft, ready;
function preload() {
  ready = loadImage("assets/color.jpeg");
  draft = loadImage("assets/bw.jpeg");
}
function setup() {
  createCanvas(600, 400);
  noCursor();
  //cursor("assets/brush.png", 20, -10);
  image(ready, 0, 0);
  image(draft, 0, 0);
}
function mouseDragged() {
  copy(ready, mouseX, mouseY, 20, 20, mouseX, mouseY, 20, 20);
}
