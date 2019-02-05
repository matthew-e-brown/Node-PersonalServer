class Rock extends SpaceObject {
  constructor(x, y, level, vel_ = undefined, vel_dir = undefined) {
    super(x, y);
    this.level = level;
    this.turnSpeed = random(0.5, 0.8);
    if (random(1.1) > 0.5) this.turnSpeed *= -1;
    this.vel = (vel_ === undefined) ? p5.Vector.random2D(this.level * 0.5) : vel_.copy().add(vel_.copy().rotate(vel_dir));
    /* Define the shape of the asteroid */
    let numPoints = floor(random(12, 16));
    for (let i = 0; i < numPoints; i++) {
      let rad = level * 20;
      this.relPoints.push(createVector(1, 0).setMag(
        rad * (random(0.65, 1.35))).rotate(360 / numPoints * i));

    }
    this.maxRad = this.computeMaxRad();
    this.health = ceil(this.level * 3.25);
    this.maxHealth = this.health;
    /* --- */
  }

  update() {
    this.angle += this.turnSpeed;
    super.update();
  }

  split() {
    if (this.level > 1) {
      rocks.push(new Rock(this.pos.x, this.pos.y, this.level - 1, this.vel, -HALF_PI));
      rocks.push(new Rock(this.pos.x, this.pos.y, this.level - 1, this.vel, +HALF_PI));
    }
    switch (this.level) {
      case 3:
        score += 20;
        break;
      case 2:
        score += 60;
        break;
      case 1:
        score += 140;
        break;
    }
  }

  show(healthbars = true) {
    super.show();
    if (healthbars) {
      fill(0);
      stroke(255);
      rectMode(CENTER);
      let y = this.pos.y + this.maxRad * 1.25;
      // rect(this.pos.x, y, this.maxRad * 1.2, 15)
      let farLeft = this.pos.x - this.maxRad * 1.2 * 0.5;
      let farRight = this.pos.x + this.maxRad * 1.2 * 0.5;
      strokeWeight(2);
      line(farLeft, y, farRight, y);
      strokeWeight(2);
      let linePos = map(this.health, 0, this.maxHealth, farLeft, farRight);
      line(linePos, y - 5, linePos, y + 5);
    }
  }

}
