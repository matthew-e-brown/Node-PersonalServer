let balls = [];
let show = true;

function setup() {
  createCanvas(600, 400);
  b1 = new Ball(200, 200, 40);
  for (let i = 0; i < 11; i++) {
    balls[i] = new Ball(0 + i * (width - 0) / 10, 50 + i * 12, 8);
  }
}

function draw() {
  background(51);
  fill(200);
  text("Click to Hide Balls", 30, 30);
  beginShape();
  vertex(0, height);
  for (let i = 0; i < balls.length; i++) {
    balls[i].update();
    vertex(balls[i].pos.x, balls[i].pos.y);
  }
  vertex(width, height);
  fill(0, 128);
  endShape();
  for (let i = 0; i < balls.length; i++) {
    if (show) balls[i].show();
  }
}

function mousePressed() {
  show = !show;
}

function Ball(_x, _y, radius) {
  this.r = radius;
  this.pos = createVector(_x, _y);
  this.vel = createVector(0, 0);
  this.acc = createVector(0, 0.1);

  this.update = function() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);

    if (this.pos.y + this.r >= height || this.pos.y - this.r <= 0) {
      this.pos.y = constrain(this.pos.y, 0 + this.r, height - this.r);
      this.vel.y *= -1;
    }
  }

  this.show = function() {
    fill(255);
    noStroke();
    ellipse(this.pos.x, this.pos.y, this.r * 2);
  }

}
