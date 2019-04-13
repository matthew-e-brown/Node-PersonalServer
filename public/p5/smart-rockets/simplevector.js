// Created in order to try and reduce overhead possibly caused by using the p5.js' much more advanced vector class.
// Not sure if this actually makes a difference.
class SimpleVector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  add(v) {
    this.x += v.x;
    this.y += v.y;
    return this;
  }

  sub(v) {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  }

  mult(k) {
    this.x *= k;
    this.y *= k;
    return this;
  }

  div(k) {
    this.x /= k;
    this.y /= k;
    return this;
  }

  normalize() {
    this.div(this.mag());
    return this;
  }

  mag() {
    return sqrt(this.x * this.x + this.y * this.y);
  }

  setMag(k) {
    this.normalize().mult(k);
    return this;
  }

  heading() {
    return Math.atan2(this.y, this.x);
  }

  copy() {
    return new SimpleVector(this.x, this.y);
  }
}

function fromAngleSimple(angle) {
  return new SimpleVector(Math.cos(angle), Math.sin(angle));
}

function random2DSimple() {
  let angle = random(TWO_PI);
  return fromAngleSimple(angle);
}
