let container;
let count = 0;

function setup() {
  createCanvas(600, 600);
  container = new Container(16, 32, createVector(width / 2, 80));
}

function draw() {
  background(51);
  container.update();
  container.show();
}
