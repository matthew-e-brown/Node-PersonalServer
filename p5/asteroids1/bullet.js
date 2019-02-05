class Bullet {
  constructor(x, y, angle) {
    this.timeAlive = 0;
    this.pos = createVector(x, y);
    this.vel = p5.Vector.fromAngle(angle, 5);
  }

  update() {
    this.timeAlive++;
    this.pos.add(this.vel);
  }

  show() {
    push(); {
      translate(this.pos.x, this.pos.y);
      rotate(this.vel.heading());
      stroke(255);
      fill(255);
      strokeWeight(1);
      ellipse(0, 0, 2.5);
    }
    pop();
  }
}
