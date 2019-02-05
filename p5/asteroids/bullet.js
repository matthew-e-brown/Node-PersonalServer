class Bullet {
  constructor(x, y, heading) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.fromAngle(radians(heading), 10);
    this.distTravelled = 0;
    this.rad = 2;
  }

  update() {
    this.distTravelled += this.vel.mag();
    this.pos.add(this.vel);
    this.timeAlive++;
    let offScreen = this.edges();
    if (offScreen[UPSIDE]) {
      this.pos.y = height + this.rad;
    }
    if (offScreen[DOWNSIDE]) {
      this.pos.y = 0 - this.rad;
    }
    if (offScreen[LEFTSIDE]) {
      this.pos.x = width + this.rad;
    }
    if (offScreen[RIGHTSIDE]) {
      this.pos.x = 0 - this.rad;
    }
  }

  edges() {
    return [
      this.pos.y < 0 - this.rad,
      this.pos.y > height + this.rad,
      this.pos.x < 0 - this.rad,
      this.pos.x > width + this.rad
    ];
  }

  show() {
    strokeWeight(1.5);
    stroke(255);
    let rear = this.pos.copy().sub(this.vel.copy().setMag(this.vel.mag()/2));
    let front = this.pos.copy().add(this.vel.copy().setMag(this.vel.mag()/2));
    line(rear.x, rear.y, front.x, front.y);
  }
}
