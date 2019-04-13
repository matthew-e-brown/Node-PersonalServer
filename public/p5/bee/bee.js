class Bee {
  constructor(x, y, size) {
    this.pos = createVector(x, y);
    this.mostRecent = createVector(x, y);
    this.angleVec = createVector(x, y);
    this.angle = HALF_PI;
    this.size = size;
    this.history = [];
    this.trailLength = 80;
    this.sprite = loadImage("data/Bee-100px.png")
  }

  update() {
    // this.pos.add(createVector(random(-1 * anger, anger), random(-1 * anger, anger)));
    this.pos.add(p5.Vector.random2D().setMag(anger));
    this.history.push(this.pos.copy());

    if (this.history.length > this.trailLength) this.history.shift();

    this.pos.x = constrain(this.pos.x, 0, width);
    this.pos.y = constrain(this.pos.y, 0, height);

    if (this.history[this.history.length - 2]) {
      this.mostRecent.x = this.history[this.history.length - 2].x;
      this.mostRecent.y = this.history[this.history.length - 2].y;
    }
    //second vector minus the first
    this.angleVec = p5.Vector.sub(this.pos, this.mostRecent);
    this.angle = this.angleVec.heading();
  }

  show() {
    //Trail
    for (let i = 0; i < this.history.length; i++) {
      if (this.history[i - 1] != null) {
        strokeWeight(map(i, this.history.length, 0, 3.5, 0));
        colorMode(HSB, 360, 100, 100);
        stroke(0, 100, map(i, this.history.length, 0, 70, 0));
        colorMode(RGB, 255, 255, 255);
        line(this.history[i].x, this.history[i].y, this.history[i - 1].x, this.history[i - 1].y);
      }
    }
    //Sprite
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.angle);
    imageMode(CENTER);
    image(this.sprite, 0, 0, this.size, this.size);
    pop();
  }
}
