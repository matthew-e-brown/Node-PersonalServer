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
  fill(255);
  stroke(0);
  strokeWeight(2);
  textSize(14);
  text(`Generation #${container.generations}\nFrame #${container.timeAlive}\nVector #${container.count}`, 20, 25);
}
