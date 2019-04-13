class Puck {
  constructor(x_, y_, r_) {
    this.pos = createVector(x_, y_);
    this.r = r_;
    this.speed = 7;
    this.vel = this.newVel();
    // console.log(this.vel);
  }

  newVel() {
    //Pick a side:
    let relAngle = random(-30, 30);
    let angle;
    if (random(2) > 1) { //50% chance
      angle = 0 + relAngle;
    } else {
      angle = 180 + relAngle;
    }
    return createVector(this.speed * cos(angle), this.speed * sin(angle));
    // console.log(rcss esult);
    // return result;
  }

  update() {
    this.pos.add(this.vel);
    if (this.pos.y - this.r <= 0 || this.pos.y + this.r >= height) this.vel.y *= -1;
    this.pos.y = constrain(this.pos.y, 0 + this.r, height - this.r);

    let offScreen = false;
    if (this.pos.x + this.r <= 0) { //Left Side
      offScreen = true;
      right.points++;
    } else if (this.pos.x - this.r >= width) { //Right Side
      offScreen = true;
      left.points++;
    }
    if (offScreen) {
      this.pos.x = width / 2;
      this.pos.y = height / 2;
      this.vel.mult(0);
      setTimeout(()=>this.vel = this.newVel(), 1500);
    }
  }

  show() {
    noStroke();
    fill(255);
    ellipse(this.pos.x, this.pos.y, this.r * 2);
  }
}
