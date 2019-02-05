class SpaceObject {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.angle = -90;
    /* PrevPos holds the position that the object was in two frames
     * ago. In the event of a collision, the object will have its
     * position reset to prevPos. This will stop the collision from
     * being counted more than once. */
    this.prevPos = createVector(x, y);
    /* Generate the shape by defining relPoints (array, type p5.vector).
     * relPoints is the coords of each point relative to the centre,
     * and points is the full (x, y) relative to point (0, 0). */
    this.relPoints = [];
    this.points = [];
    this.maxRad;
    /* the this.[side] variables hold the actual x and y positions of the
     * sides of the object. This this.C[side] hold the side of the object
     * used for collisions (in the nearby() function).  */
    this.top, this.bottom, this.left, this.right;
    this.Ctop, this.Cbottom, this.Cleft, this.Cright;
  }

  /* Will be called in each child object after the super() constructor,
   * once all the points have been set. This is to figure out how
   * far away the farthest point is from the center. This way, we
   * check every object with a circle-check (if dist < both radii)
   * before doing the more complicated polygon check. This will
   * save resources. */
  computeMaxRad() {
    let dists = [];
    for (let i = 0; i < this.relPoints.length; i++) {
      dists.push(dist(0, 0, this.relPoints[i].x, this.relPoints[i].y));
    }
    return max(dists);
  }

  /* This function moves the object around and does the all of it's
   * computations. This is the method which is called in the main
   * draw loop. This function calls other functions defined in the
   * class, in order to make this method simpler. */
  update() {
    if (frameCount % 2 == 0) this.prevPos = this.pos.copy();
    this.pos.add(this.vel);
    /* Generate the actual points using the points relative to the centre of
     * the object and the position. */
    this.points = []; /* Get rid of the ones from last frame first */
    for (let i = 0; i < this.relPoints.length; i++) {
      let relPoint = this.relPoints[i].copy();
      relPoint.rotate(90 + this.angle);
      this.points.push(
        createVector(relPoint.x + this.pos.x, relPoint.y + this.pos.y)
      );
      // this.points[i].rotate(radians(this.angle));
      /* ^^-- This rotates it around the origin --^^ */
      /* Display by translating to position, rotating by angle,
       * then drawing relPoints.
       * So, we need to rotate the actual points to match the consmetic points,
       * as these will be used outside of the objects for calculations. */
    }
    this.angle %= 360; /* Just to keep the angle reasonable. */

    let x = [],
      y = [];
    for (let i = 0; i < this.points.length; i++) {
      x.push(this.points[i].x);
      y.push(this.points[i].y);
    }

    let tolerance = 2.5;
    this.Ctop = min(y) - tolerance;
    this.Cbottom = max(y) + tolerance;
    this.Cleft = min(x) - tolerance;
    this.Cright = max(x) + tolerance;

    this.top = min(y);
    this.bottom = max(y);
    this.left = min(x);
    this.right = max(x);

    /* Determine if the object is off-screen. If it is, wrap it. */
    /* The output of the edges function is stored in a variable
     * to avoid running it multiple times in the same frame. */
    let offScreen = this.edges();
    if (offScreen[UPSIDE]) {
      this.pos.y = height + this.maxRad;
    }
    if (offScreen[DOWNSIDE]) {
      this.pos.y = 0 - this.maxRad;
    }
    if (offScreen[LEFTSIDE]) {
      this.pos.x = width + this.maxRad;
    }
    if (offScreen[RIGHTSIDE]) {
      this.pos.x = 0 - this.maxRad;
    }
  }

  /* This method returns an array of four booleans. One for
   * UP, DOWN, LEFT, and RIGHT. If the boolean is set to true,
   * then that means that the object is off that edge. */
  edges() {
    return [
      (this.bottom < 0 - this.maxRad),
      (this.top > height + this.maxRad),
      (this.right < 0 - this.maxRad),
      (this.left > width + this.maxRad)
    ];
  }

  show() {
    push();
    /* Transformations */
    translate(this.pos.x, this.pos.y);
    rotate(90 + this.angle);
    /* --- end Transformations --- */
    /* Style */
    fill(0);
    // noFill();
    stroke(255);
    strokeWeight(1);
    /* --- end Style --- */
    /* Draw */
    beginShape();
    for (let i = 0; i < this.relPoints.length; i++) {
      vertex(this.relPoints[i].x, this.relPoints[i].y);
    }
    endShape(CLOSE);
    /* --- end Draw --- */
    pop();

    if (debug) {
      stroke(255, 255, 0, 200);
      strokeWeight(4);
      for (let i = 0; i < this.points.length; i++) {
        point(this.points[i].x, this.points[i].y);
      }

      /* These lines will outline the object in question */
      /* Collisions */
      if ((player != this) && nearby(player, this)) stroke(255, 0, 0);
      else if (player == this) stroke(0, 255, 0);
      else stroke(255, 255, 0);
      strokeWeight(0.5);
      let ext = 7.5;
      line(this.Cleft - ext, this.Ctop, this.Cright + ext, this.Ctop);
      line(this.Cleft - ext, this.Cbottom, this.Cright + ext, this.Cbottom);
      line(this.Cleft, this.Ctop - ext, this.Cleft, this.Cbottom + ext);
      line(this.Cright, this.Ctop - ext, this.Cright, this.Cbottom + ext);
      /* Actual Outline */
      stroke(255);
      line(this.left, this.top, this.right, this.top);
      line(this.left, this.bottom, this.right, this.bottom);
      line(this.left, this.top - ext, this.left, this.bottom);
      line(this.right, this.top - ext, this.right, this.bottom);
      /* --- */
    }
  }
}
