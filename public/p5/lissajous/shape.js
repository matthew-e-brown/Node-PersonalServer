class Shape {
  constructor(hue) {
    // this.points = [];
    this.x = [];
    this.y = [];
    this.hue = hue;
  }

  addPoint(x, y) {
    // this.points.push(createVector(x, y));
    this.x.push(x);
    this.y.push(y);
  }

  show() {
    colorMode(HSB, 360, 100, 100);
    noFill();
    stroke(this.hue, 100, 100);
    strokeWeight(strokeThick);
    beginShape();
    for (let i = 0; i < this.x.length; i++) {
      vertex(this.x[i], this.y[i]);
    }
    endShape();
    colorMode(RGB, 255);
  }
}
