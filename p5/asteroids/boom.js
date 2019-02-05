class Explosion {
  constructor(x, y) {
    this.points = [];
    let numPoints = 36;
    for (let i = 0; i < numPoints; i++) {
      this.points.push({
        pos: createVector(x, y),
        vel: p5.Vector.fromAngle(360 / numPoints * i).setMag(random(1, 3))
      });
    }
    this.timeAlive = 0;
  }

  show() {
    this.timeAlive++;
    stroke(255, 255, 255, map(this.timeAlive, 0, 60, 255, 0));
    strokeWeight(map(this.timeAlive, 0, 60, 3, 0));
    this.points.forEach((p) => {
      p.pos.add(p.vel);
      point(p.pos.x, p.pos.y);
    });
  }
}
