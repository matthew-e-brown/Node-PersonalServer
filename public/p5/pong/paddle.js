class Paddle {
  constructor(place) {
    this.speed = 6;
    this.points = 0;
    this.place = place;
    this.w = 20;
    this.h = 100;
    if (this.place == LEFT) this.x = this.w * 2;
    else this.x = width - this.w * 2;
    this.y = height / 2;

    this.up = false;
    this.down = false;

    this.sections = [];
    for (let i = 0; i < 8; i++) {
      this.sections[i] = {top: 0, bottom: 0};
    }
  }

  update() {
    for (let i = 0; i < this.sections.length; i++) {
      let paddleTop = this.y - this.h/2;
      this.sections[i] = {
        top: paddleTop + (this.h/this.sections.length)*i,
        bottom: paddleTop + this.h/this.sections.length + (this.h/this.sections.length)*i
      };
    }

    if (this.up) {
      this.y -= this.speed;
    }
    if (this.down) {
      this.y += this.speed;
    }
    this.y = constrain(this.y, 0 + this.h / 2, height - this.h / 2);
  }

  show() {
    rectMode(CENTER);
    noStroke();
    fill(255);
    rect(this.x, this.y, this.w, this.h);
    textAlign(CENTER, CENTER);
    push(); {
      fill(0);
      translate(this.x, this.y);
      rotate(-1 * 90);
      if (this.place == LEFT) text("W / S", 0, 0);
      else text("I / K", 0, 0);
    }
    pop();
    // stroke(255, 0, 0);
    // for (let i = 0; i < this.sections.length; i++) {
    //   line(0, this.sections[i].top, width, this.sections[i].top);
    //   line(0, this.sections[i].bottom, width, this.sections[i].bottom);
    // }
  }
}
