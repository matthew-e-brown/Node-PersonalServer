class Rocket {
  constructor(x, y, geneLength, inputDNA) {
    this.size = 20;

    this.pos = new SimpleVector(x, y);
    this.vel = new SimpleVector(0, 0);
    this.acc = new SimpleVector(0, 0);

    this.thrust = 0.2;
    this.timeAlive = 0;
    this.wallBumps = 0;
    this.recentHeading = 0;

    this.history = [];

    if (inputDNA) this.dna = inputDNA;
    else this.dna = new DNA(geneLength);
    this.dead = false;
    this.fitness = 0;

    this.tailHue = random(0, 340);
  }

  applyForce(vector) {
    this.acc.add(vector);
  }

  applyGene(index) {
    this.recentHeading = this.dna.genes[index].heading();
    this.applyForce(this.dna.genes[index]);
  }

  update(obstacles) {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);

    this.history.push({
      x: this.pos.x + this.size * 0.5,
      y: this.pos.y + this.size * 0.5
    });
    if (this.history.length > 48) this.history.shift();

    //Drag:
    this.applyForce(this.vel.copy().mult(-0.0005 * this.vel.mag()), false);

    //Gravity:
    this.applyForce(createVector(0, 0.005), false);

    const edges = this.edges();
    if (edges[0] || edges[2] || edges[3]) {
      this.wallBumps++;
      if (edges[0]) {
        this.pos.y = 0;
        this.vel.y *= -0.8;
      }
      if (edges[2]) {
        this.pos.x = 0;
        this.vel.x *= -0.8;
      }
      if (edges[3]) {
        this.pos.x = width - this.size;
        this.vel.x *= -0.8;
      }
    }
    if (this.wallBumps >= 3 || edges[1]) this.dead = true;

    //Obstacles:
    if (obstacles) {
      for (const obs of obstacles) {
        if (obs.collideRect(this.pos.x, this.pos.y, this.size, this.size)) {
          this.applyForce(this.pos.copy().add(new SimpleVector(10, 10)).sub(new SimpleVector(obs.x + obs.w * 0.5, obs.y + obs.h * 0.5)).setMag(this.vel.mag()));
        }
      }
    }

    this.timeAlive++;
  }

  calculateFitness(target) {
    // let fitness = sqrt(pow(target.x - this.pos.x, 2) + pow(target.y - this.pos.y, 2));
    let fitness = 100 / dist(target.x, target.y, this.pos.x + this.size * 0.5, this.pos.y + this.size * 0.5);
    if (fitness == Infinity) {
      fitness = 240;
      console.log("Infinity! // Touched Target");
    }
    if (this.dead) return fitness * 0.1;
    else return fitness / (this.wallBumps + 1);
    //Distance to target squared
  }

  edges() {
    //Array of bools, top-bottom-left-right;
    return [
      this.pos.y <= 0,
      this.pos.y + this.size >= height,
      this.pos.x <= 0,
      this.pos.x + this.size >= width
    ];
  }

  show() {
    //Trail:
    colorMode(HSB, 360, 100, 100);
    // for (let i = 0; i < this.history.length; i++) {
    //   stroke(this.tailHue, 100, 100, map(i, 0, this.history.length, 0, 255));
    //   strokeWeight(map(i, 0, this.history.length, 0.15, 3.25));
    //   if (this.history[i - 1]) {
    //     let start = {
    //       x: this.history[i].x,
    //       y: this.history[i].y
    //     };
    //     let end = {
    //       x: this.history[i - 1].x,
    //       y: this.history[i - 1].y
    //     };
    //     line(start.x, start.y, end.x, end.y);
    //   }
    // }

    fill(0, map((!this.dead) ? this.wallBumps : 3, 0, 3, 0, 100), 100);
    colorMode(RGB, 255, 255, 255);
    stroke(0);
    strokeWeight(2);
    push();
    translate(this.pos.x + this.size * 0.5, this.pos.y + this.size * 0.5);
    rotate(Math.PI + this.recentHeading);
    rect(this.size * -0.125, this.size * -0.125, this.size, this.size * 0.25);
    pop();
    rect(this.pos.x, this.pos.y, this.size, this.size);
  }
}
