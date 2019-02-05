class Player {

  constructor() {
    this.pos = createVector(width / 2, height / 2);
    this.vel = createVector(0, 0);
    this.angle = -HALF_PI;
    this.speed = 0.1;
    this.turnspeed = 0.05;
    this.w = 25;
    this.h = 35;
    this.cooldown = 10;
    this.sinceShot = 30;
    this.sinceWrap = 10;
    this.points = new Array(4);
    this.flame = new Array(4);
    this.rawpoints = [];
  }

  update() {
    if (up) this.thrust(this.speed);
    if (left) this.angle -= this.turnspeed;
    if (right) this.angle += this.turnspeed;
    if (space && this.cooldown - this.sinceShot <= 0) {
      this.fire();
      this.sinceShot = 0;
    }
    this.sinceShot++;
    this.pos.add(this.vel);
    this.drag();

    let zero = 0 - this.h * 0.5;

    //Rocket
    this.points[0] = createVector(0, zero).rotate(HALF_PI + this.angle).add(this.pos);
    this.points[0].name = "Nose"; // Names are useful for debugging in Chrome
    this.points[1] = createVector(0 - this.w * 0.5, zero + this.h).rotate(HALF_PI + this.angle).add(this.pos);
    this.points[1].name = "Left Fin Tip";
    this.points[2] = createVector(0, zero + this.h * 0.8).rotate(HALF_PI + this.angle).add(this.pos);
    this.points[2].name = "Engine Divit";
    this.points[3] = createVector(0 + this.w * 0.5, zero + this.h).rotate(HALF_PI + this.angle).add(this.pos);
    this.points[3].name = "Right Fin Tip";

    //Flame
    this.flame[0] = createVector(0, zero + this.h * 0.8).rotate(HALF_PI + this.angle);
    this.flame[1] = createVector(0 - this.w * 0.25, zero + this.h - this.h * 0.25).rotate(HALF_PI + this.angle);
    this.flame[2] = createVector(0, zero + this.h * 1.2).rotate(HALF_PI + this.angle);
    this.flame[3] = createVector(0 + this.w * 0.25, zero + this.h - this.h * 0.25).rotate(HALF_PI + this.angle);

    if (this.cooldown - this.sinceWrap <= 0) {
      this.sinceWrap = 0;
      if (this.pos.x < 0 - this.w * 0.5) this.pos.x = width;
      if (this.pos.x > width + this.w * 0.5) this.pos.x = 0;
      if (this.pos.y < 0 - this.h * 0.5) this.pos.y = height;
      if (this.pos.y > height + this.h * 0.5) this.pos.y = 0;
    }
    this.sinceWrap++;

  }

  show() {
    // push(); {
    // translate(this.pos.x, this.pos.y);
    noFill();
    strokeWeight(1);
    stroke(255);

    //Draw Flame
    if (up) {
      beginShape();
      for (let i = 0; i < this.flame.length; i++) {
        vertex(this.flame[i].x + this.pos.x, this.flame[i].y + this.pos.y);
      }
      endShape(CLOSE);
    }

    //Draw Body
    fill(0);
    beginShape();
    for (let i = 0; i < this.points.length; i++) {
      vertex(this.points[i].x, this.points[i].y);
    }
    endShape(CLOSE);
    // }
    // pop();

    //Diagnostic Points
    strokeWeight(4);
    for (let i = 0; i < this.points.length; i++) {
      if (i == cp[PLAYER]) stroke(255, 0, 0);
      else stroke(255, 255, 0);
      point(this.points[i].x, this.points[i].y);
    }

  }

  thrust(force) {
    let acc = p5.Vector.fromAngle(this.angle, force);
    this.vel.add(acc);
  }

  drag() {
    this.vel.sub(this.vel.copy().setMag(this.vel.mag() * 0.025));
  }

  fire() {
    let x = this.pos.x + cos(this.angle) * this.w * 0.5;
    let y = this.pos.y + sin(this.angle) * this.h * 0.5;
    bullets.push(new Bullet(x, y, this.angle));
  }
}
