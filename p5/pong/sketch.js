const LEFT = -1;
const RIGHT = 1;

let puck;
let left, right;

let font;

let started;

// function preload() {
//   font = loadFont("137.otf");
// }

function setup() {
  createCanvas(800, 600);
  // textFont(font);
  puck = new Puck(width / 2, height / 2, 10);
  left = new Paddle(LEFT);
  right = new Paddle(RIGHT);
  angleMode(DEGREES);
  started = false;
}

function mousePressed() {
  started = true;
}

function draw() {
  background(51);

  if (!started) {
    textAlign(CENTER, CENTER);
    textSize(18);
    text("Click to Start!", width / 2, height / 2);
  } else {
    puck.update();
    puck.show();
  }

  textAlign(CENTER, TOP);
  textSize(36);
  text(left.points, width / 4 * 1, height / 8);
  text(right.points, width / 4 * 3, height / 8);
  textAlign(CENTER, CENTER);
  textSize(12);


  [left, right].forEach((paddle) => {
    paddle.update();
    paddle.show();
    let puckSides = {
      top: puck.pos.y - puck.r,
      bottom: puck.pos.y + puck.r,
      left: puck.pos.x - puck.r,
      right: puck.pos.x + puck.r
    }
    let paddleSides = {
      top: paddle.y - paddle.h / 2,
      bottom: paddle.y + paddle.h / 2,
      left: paddle.x - paddle.w / 2,
      right: paddle.x + paddle.w / 2
    }
    if (puckSides.left <= paddleSides.right && puckSides.right >= paddleSides.left && puckSides.top <= paddleSides.bottom && puckSides.bottom >= paddleSides.top) {
      //HIT!!
      // console.log("Hit on Paddle #" + paddle.place + " at section #" + getSection(paddle, puck.pos.y));
      let sec = getSection(paddle, puck.pos.y);
      let newAngle = map(sec, 0, paddle.sections.length - 1, -60, 60);
      puck.vel = createVector((-1 * paddle.place) * puck.speed * cos(newAngle), puck.speed * sin(newAngle));
    }
  });
}

function getSection(paddle, y) {
  // console.log("Y: " + y);
  for (let i = 0; i < paddle.sections.length; i++) {
    //console.log(i);
    let s = paddle.sections[i];
    // console.log("top: " + s.top + " bottom: " + s.bottom);
    if (y >= s.top && y < s.bottom) {
      // console.log("test");
      return i;
    }
  }
  if (y < paddle.y - paddle.h / 2) return 0;
  else if (y > paddle.y + paddle.h / 2) return paddle.sections.length - 1;
  // return "nope";
}

function keyPressed() {
  if (keyCode === 87) left.up = true;
  if (keyCode === 83) left.down = true;
  // ---
  if (keyCode === 73) right.up = true;
  if (keyCode === 75) right.down = true;
}

function keyReleased() {
  if (keyCode === 87) left.up = false;
  if (keyCode === 83) left.down = false;
  // ---
  if (keyCode === 73) right.up = false;
  if (keyCode === 75) right.down = false;
}
