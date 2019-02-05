class Player extends SpaceObject {
  constructor(x, y, w, h) {
    super(x, y);
    this.w = w, this.h = h;
    /* Define the shape of the rocket, relative to the centre... */
    this.relPoints.push(createVector(0, -h * 0.5));
    this.relPoints.push(createVector(-w * 0.5, h * 0.5));
    this.relPoints.push(createVector(0, h * 0.365));
    this.relPoints.push(createVector(w * 0.5, h * 0.5));
    /* Then figure out which point is farthest from the centre.
     * see parent class for details. */
    this.maxRad = this.computeMaxRad();

    /* The three points used to create the flame */
    this.flame = [];
    this.reverse = true;

    /* The cooldown defines how much time must pass before the
     * player may fire again. */
    this.cooldown = 2; /* Really small cooldown because they have to press each time */
    this.timeSinceShot = this.cooldown;
    this.fired = false;

    /* How much the angle (in degrees) of the ship will change
     * by every frame the the left/right key is held down. */
    this.turnSpeed = 3.56;
    /* How fast the rocket accelerates */
    this.thrust = 0.2;
    /* Set the maximum speed of the rocket */
    this.maxSpeed = 8;

    this.health = 5;
    this.gracePeriod = 60 /*expected FPS*/ * 2 /*seconds*/ ;
    this.timeInGrace = 0; /* Time they've been invincible, in frames */
    this.grace = true; /* Players get a grace period after being hit */
    this.visible = true; /* This will be toggled on and off while the player is in their grace period */
  }

  hit() {
    this.health--;
    this.grace = true;
    this.timeInGrace = 0;
  }

  update() {
    /* Move, generate actual points */
    super.update();

    if (this.grace) {
      this.timeInGrace++;
      if (this.gracePeriod - this.timeInGrace < 0) {
        this.grace = false;
        this.visible = true;
      } else if (frameCount % 5 == 0) {
        this.visible = !this.visible;
      }
    }

    /* Flame must have it's points recalculated every frame
     * in order to account for rotation. */
    this.flame = [
      createVector(
        -this.w * 0.365, this.h * 0.365).rotate(
        90 + this.angle).add(
        this.pos),
      createVector(
        this.w * 0.365, this.h * 0.365).rotate(
        90 + this.angle).add(
        this.pos),
      createVector(
        0, this.h * random(0.5, 0.7)).rotate(
        90 + this.angle).add(
        this.pos)
    ];

    /* Add controls */
    this.reverse = false;
    if (up) {
      if (this.vel.mag() < this.maxSpeed) this.vel.add(p5.Vector.fromAngle(radians(this.angle), this.thrust));
      /* Generate acceleration vector, add it to velocity.
       * This way, it is regenerated every frame and so
       * it doesn't accumulate. */
      if (!mute) thrust.play();
    }
    if (down) { /* During testing, allow to move backwards */
      if (debug) this.vel.add(p5.Vector.fromAngle(radians(this.angle), this.thrust).mult(-0.5));
      else {
        this.vel.sub(this.vel.copy().setMag(this.vel.mag() * 0.05));
        this.reverse = true;
      }
    }

    if (left) this.angle -= this.turnSpeed;
    if (right) this.angle += this.turnSpeed;

    if (space && this.cooldown - this.timeSinceShot <= -1 /*to account for when it gets added again below*/ && !this.fired) {
      this.fire();
      this.timeSinceShot = 0;
      this.fired = true;
    }
    if (!space) this.fired = false;
    this.timeSinceShot++;

    /* Add drag */
    this.vel.sub(this.vel.copy().setMag(this.vel.mag() * 0.025));
  }

  fire() {
    bullets.push(new Bullet(this.points[0].x, this.points[0].y, this.angle));
    if (!mute) shoot.play();
  }

  show() {
    if (this.visible) {
      fill(0);
      stroke(255);
      strokeWeight(1);
      if (up) triangle(this.flame[0].x, this.flame[0].y,
        this.flame[1].x, this.flame[1].y,
        this.flame[2].x, this.flame[2].y);
      super.show();
    }

    if (this.reverse) {
      strokeWeight(0.25);
      stroke(255);
      push();
      translate(this.pos.x, this.pos.y);
      rotate(90 + this.angle);
      noFill();
      beginShape();
      vertex(0 * 1.4, -this.h * 0.5 * 1.4);
      vertex(-this.w * 0.5 * 1.25, this.h * 0.5 * 1.25);
      vertex(0 * 1.25, this.h * 0.365 * 1.25);
      vertex(this.w * 0.5 * 1.25, this.h * 0.5 * 1.25);
      endShape(CLOSE);
      // line(this.relPoints[0].x, this.relPoints[0].y - this.h * 0.25, this.relPoints[1].x - this.w * 0.1, this.relPoints[1].y - this.h * 0.25);
      // line(this.relPoints[0].x, this.relPoints[0].y - this.h * 0.25, this.relPoints[3].x + this.w * 0.1, this.relPoints[3].y - this.h * 0.25);
      pop();
    }
  }
}
