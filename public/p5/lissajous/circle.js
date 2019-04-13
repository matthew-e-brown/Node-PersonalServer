class Circle {
  constructor(x_, y_, r_, v_) {
    this.xPos = x_;
    this.yPos = y_;
    this.r = r_;
    this.v = v_;
    this.angle = -90;
    this.point = createVector(this.xPos + r_ * cos(this.angle), this.yPos + r_ * sin(this.angle));
  }

  update() {
    this.angle = (this.angle -= this.v);
    this.point.x = this.xPos + this.r * cos(this.angle);
    this.point.y = this.yPos + this.r * sin(this.angle);
  }

  show() {
    noFill();
    stroke(255);
    strokeWeight(strokeThick);
    ellipse(this.xPos, this.yPos, this.r * 2, this.r * 2);
    strokeWeight(pointWeight);
    point(this.point.x, this.point.y);
  }
}
