class Obstacle {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  collideRect(x, y, w, h) {
    return (this.x + this.w >= x) && // Is the RIGHT edge of r1 to the RIGHT of the LEFT edge of r2?
      (this.x <= x + w) && // Is the LEFT edge of r1 to the LEFT of the RIGHT edge of r2?
      (this.y + this.h >= y) && // Is the BOTTOM edge of r1 BELOW the TOP edge of r2?
      (this.y <= y + h);// Is the TOP edge of r1 ABOVE the BOTTOM edge of r2?
  }

  show() {
    stroke(0);
    strokeWeight(2);
    fill(255, 255, 255);
    rect(this.x, this.y, this.w, this.h);
  }
}
