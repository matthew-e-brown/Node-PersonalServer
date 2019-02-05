class Button {
  constructor(text, x, y, w, h, fi = color(0), st = color(255), fih = color(20), sth = color(128)) {
    this.text = text;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.st = st;
    this.sth = sth;
    this.fi = fi;
    this.fih = fih;
  }

  mouseOver() {
    let ex = false;
    let why = false;
    if (mouseX >= this.x - this.w * 0.5 && mouseX <= this.x + this.w * 0.5) ex = true;
    if (mouseY >= this.y - this.h * 0.5 && mouseY <= this.y + this.h * 0.5) why = true;
    if (ex && why) return true;
    else return false;
  }

  /* Pass a true boolean in here to highlight the button regardless of mouse pos */
  show(override = false) {
    let highlight = this.mouseOver() || override;
    strokeWeight(2);
    if (this.st === undefined) noStroke();
    else {
      if (highlight) stroke(this.sth);
      else stroke(this.st);
    }
    if (this.fi === undefined) noFill();
    else {
      if (highlight) fill(this.fih);
      else fill(this.fi);
    }

    rectMode(CENTER);
    rect(this.x, this.y, this.w, this.h);

    fill(this.st);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(this.h * 0.25);
    text(this.text, this.x, this.y);
  }

}
