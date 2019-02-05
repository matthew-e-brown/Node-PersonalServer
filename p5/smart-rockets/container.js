class Container {
  constructor(numRockets, geneLength, targetPos) {
    this.geneLength = geneLength;
    this.numRockets = numRockets;
    this.target = targetPos;
    this.count = 0;
    this.timeAlive = 0;

    this.rockets; //must be declared here for scope
    this.generateFresh();

    this.obstacles;
    this.generateObstacles(5);
  }

  generateObstacles(n) {
    let x, y, w, h;
    let t = this.target;
    this.obstacles = [];
    for (let i = 0; i < n; i++) {
      do {
        w = random(30, 100);
        h = random(30, 100);
        x = random(width - w);
        y = random(height - h);
      } while (((x + w > t.x) && (x < t.x)) && ((y + h > t.y) && (y < t.y)));
      this.obstacles.push(new Obstacle(x, y, w, h));
    }
  }

  generateFresh() {
    this.rockets = [];
    for (let i = 0; i < this.numRockets; i++) {
      this.rockets.push(new Rocket(width / 2, height - 30, this.geneLength));
    }
  }

  generateNext() {
    for (let r of this.rockets) {
      r.fitness = r.calculateFitness(this.target);
    }
    let maxFitness = Number.NEGATIVE_INFINITY;
    let minFitness = Number.POSITIVE_INFINITY;
    for (let r of this.rockets) {
      if (r.fitness < minFitness) minFitness = r.fitness;
      if (r.fitness > maxFitness) maxFitness = r.fitness;
    }

    // console.log(`MinFitness: ${minFitness}, MaxFitness: ${maxFitness}`)
    let matingPool = [];
    for (let r of this.rockets) {
      // r.fitness = round(8 * Math.log2(24 * r.fitness + 1));
      //Came up with this by just messing around with a graph.
      // https://www.desmos.com/calculator/emxf0zobzc
      // console.log(`Copies in Mating Pool: ${r.fitness}`);
      r.fitness = map(r.fitness, minFitness, maxFitness, 1, 100);
      for (let i = 0; i < r.fitness; i++) {
        matingPool.push(r.dna);
      }
    }
    // console.log(matingPool);
    // noLoop();

    this.rockets = [];
    for (let i = 0; i < this.numRockets; i++) {
      let indexA = floor(random(matingPool.length));
      let indexB = indexA;
      while (indexA == indexB) indexB = floor(random(matingPool.length));
      let parentA = matingPool[indexA];
      let parentB = matingPool[indexB];

      this.rockets.push(new Rocket(width / 2, height - 30, this.geneLength, parentA.crossover(parentB)));
    }
  }

  update() {
    if (this.count == this.geneLength) {
      this.generateNext();
      this.timeAlive = 0;
      this.count = 0;
    } else {
      let flag = false;
      for (let r of this.rockets) {
        if (this.timeAlive % 10 == 0) {
          if (!r.dead) r.applyGene(this.count);
          flag = true;
        }
        if (!r.dead) {
          r.update(this.obstacles);
          if (dist(this.target.x, this.target.y, r.pos.x + r.size * 0.5, r.pos.y + r.size * 0.5) < r.size * 0.5) {
            r.pos.x = this.target.x - r.size * 0.5;
            r.pos.y = this.target.y - r.size * 0.5;
          }
        }
      }
      this.timeAlive++;
      if (flag) this.count++;
    }
  }

  show() {
    for (let o of this.obstacles) o.show();
    for (let r of this.rockets) r.show();
    fill(255, 128, 0);
    stroke(0);
    strokeWeight(2);
    ellipse(this.target.x, this.target.y, 12, 12);
  }
}
