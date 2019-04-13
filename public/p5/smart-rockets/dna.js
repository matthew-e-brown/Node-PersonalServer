class DNA {
  constructor(length, inputGenes = undefined) {
    this.genes = [];
    if (inputGenes !== undefined) {
      this.genes = inputGenes;
    } else {
      for (let i = 0; i < length; i++) {
        // this.genes.push(p5.Vector.random2D().setMag(0.45));
        this.genes.push(random2DSimple().setMag(0.45));
      }
    }
  }

  crossover(partner) {
    let spliceIndex = floor(random(this.genes.length));
    let newGenes = [];
    for (let i = 0; i < this.genes.length; i++) {
      newGenes.push((i <= spliceIndex) ? this.genes[i] : partner.genes[i]);
    }
    let newDNA = new DNA(this.genes.length, newGenes);
    newDNA.mutate();
    return newDNA;
  }

  mutate() {
    let numMutations = 2;
    //floor(random(this.genes.length) / 8);
    for (let i = 0; i < numMutations; i++) {
      this.genes[floor(random(this.genes.length))] = random2DSimple().setMag(0.45);
    }
  }
}
