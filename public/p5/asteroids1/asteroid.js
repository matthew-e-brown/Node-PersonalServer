class Asteroid {
  constructor(x, y, size) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D();
    this.size = size;
    this.diam = 20 * size;
    this.spin = random(0.05);
    this.points = [];
    this.num = -1;
    this.biggestRad = 0;
    this.timeSinceWrap = 0;
    let numPoints = int(random(8, 12));
    for (let i = 0; i < numPoints; i += 1) {
      let rad = this.diam * random(0.65, 1.35);
      if (rad >= this.biggestRad) this.biggestRad = rad;
      this.points[i] = createVector(1, 0).setMag(rad).rotate(TWO_PI / numPoints * i);
    }
    this.rawpoints = [];
  }

  update() {
    this.pos.add(this.vel);
    for (let i = 0; i < this.points.length; i++) {
      this.points[i].rotate(this.spin);
    }

    this.rawpoints = new Array(this.points.length);

    //Wrap
    let x = [];
    let y = [];
    for (let i = 0; i < this.points.length; i++) {
      x.push(this.pos.x + this.points[i].x);
      y.push(this.pos.y + this.points[i].y);
    }

    this.leftPoint = min(x);
    this.rightPoint = max(x);
    this.topPoint = min(y);
    this.botPoint = max(y);

    if (this.timeSinceWrap - 30 >= 0) {
      if (this.leftPoint > width) {
        this.pos.x = 0 - this.biggestRad;
        this.timeSinceWrap = 0;
      }
      if (this.rightPoint < 0) {
        this.pos.x = width + this.biggestRad;
        this.timeSinceWrap = 0;
      }
      if (this.topPoint > height) {
        this.pos.y = 0 - this.biggestRad;
        this.timeSinceWrap = 0;
      }
      if (this.botPoint < 0) {
        this.pos.y = height + this.biggestRad;
        this.timeSinceWrap = 0;
      }
    }
    this.timeSinceWrap++;

    for (let i = 0; i < this.rawpoints.length; i++) {
      this.rawpoints[i] = createVector(this.pos.x + this.points[i].x,this.pos.y + this.points[i].y);
    }
  }

  show() {
    noFill();
    if (this.num == cp[ROCK]) stroke(255, 128, 0);
    else stroke(255);
    strokeWeight(1);
    // push(); {
    //   translate(this.pos.x, this.pos.y);
    //   textAlign(CENTER, CENTER);
    //   text(this.num, 0, 0);
    //   beginShape();
    //   for (let i = 0; i < this.points.length; i++) {
    //     vertex(this.points[i].x, this.points[i].y);
    //   }
    //   endShape(CLOSE);
    // }
    // pop();

    textAlign(CENTER, CENTER);
    text(this.num, 0, 0);
    beginShape();
    for (let i = 0; i < this.rawpoints.length; i++) {
      vertex(this.rawpoints[i].x, this.rawpoints[i].y);
    }
    endShape(CLOSE);

    // Diagnostic Points
    strokeWeight(6);
    for (let i = 0; i < this.points.length; i++) {
      if (this.num == cp[ROCK] && (i == cp[ROCKPOINTS][0] || i == cp[ROCKPOINTS][1])) {
        stroke(255, 0, 0);
      } else stroke(255, 255, 0);
      point(this.pos.x + this.points[i].x, this.pos.y + this.points[i].y);
    }
  }
}
