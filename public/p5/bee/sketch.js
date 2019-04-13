let bees;
let anger;
let queenpos;

const minAnger = 1;
const maxAnger = 8;
const beeSize = 20;
let up, down, left, right;

function setup() {
  up = down = left = right = false;
  createCanvas(600, 400);
  bees = [];
  for (let i = 0; i < 5; i++) {
    bees[i] = new Bee(random(width), random(height), beeSize);
  }
  queenPos = createVector(random(0 + 30, width - 30), random(0 + 30, height - 30));
  maxQueenDist = function() {
    let dists = [];
    dists[0] = dist(queenPos.x, queenPos.y, 0, 0);
    dists[1] = dist(queenPos.x, queenPos.y, width, 0);
    dists[2] = dist(queenPos.x, queenPos.y, 0, height);
    dists[3] = dist(queenPos.x, queenPos.y, width, height);
    return Math.max(...dists);
  }
}

function keyPressed() {
  if (keyCode === UP_ARROW || keyCode === 87) up = true;
  if (keyCode === DOWN_ARROW || keyCode === 83) down = true;
  if (keyCode === LEFT_ARROW || keyCode === 65) left = true;
  if (keyCode === RIGHT_ARROW || keyCode === 68) right = true;
}

function keyReleased() {
  if (keyCode === UP_ARROW || keyCode === 87) up = false;
  if (keyCode === DOWN_ARROW || keyCode === 83) down = false;
  if (keyCode === LEFT_ARROW || keyCode === 65) left = false;
  if (keyCode === RIGHT_ARROW || keyCode === 68) right = false;
}

function mousePressed() {
  let kill = false;
  for (let i = 0; i < bees.length; i++) {
    if (dist(mouseX, mouseY, bees[i].pos.x, bees[i].pos.y) <= bees[i].size) {
      bees.splice(i, 1);
      kill = true;
    }
  }
  if (!kill) bees.push(new Bee(mouseX, mouseY, beeSize));
}

function draw() {
  background(51);

  if (up) queenPos.y -= 1;
  if (down) queenPos.y += 1;
  if (left) queenPos.x -= 1;
  if (right) queenPos.x += 1;

  queenPos.x = constrain(queenPos.x, 0, width);
  queenPos.y = constrain(queenPos.y, 0, height);

  let distQueen = dist(mouseX, mouseY, queenPos.x, queenPos.y);

  anger = minAnger;
  if (mouseX <= width && mouseX >= 0 && mouseY <= height && mouseY >= 0) {
    anger = map(distQueen, maxQueenDist(), 0, minAnger, maxAnger)
  }

  //Draw Bees and Queen
  for (let bee of bees) {
    bee.update();
    bee.show();
  }
  fill(255, 128, 50);
  stroke(255);
  strokeWeight(1);
  ellipse(queenPos.x, queenPos.y, 30);

  //Text:
  fill(255);
  textAlign(CENTER);
  noStroke();
  text("Don't get your mouse too close to the queen!", width / 2, height * 3 / 4);
  text("Anger level: " + round(anger * 100) / 100, width / 2, height * 3 / 4 + 12);
  strokeWeight(0.5);
  stroke(255);
  fill(0);
  rect(width / 2 - 30, height * 3 / 4 + 24, 60, 12);
  fill(150, 0, 0);
  rect(width / 2 - 30, height * 3 / 4 + 24, map(anger, minAnger, maxAnger, 2, 60), 12);
  noStroke();
  fill(255, 128, 50);
  text("(This is the queen)\n(You can move her w/ arrows or WASD)\n(just for funzies)", queenPos.x, queenPos.y + 28);
}

//LOL nvm this is built into p5.js
// function constrain(v, min, max) {
//   //let lowerbound = Math.max(min, v);
//   //"Which is bigger? the lower limit or the value?"
//   //If the lower limit is biger, return that
//   //Otherwise, return the value because it's higher than the lower limit
//   //let higherbound = Math.min(max, highest);
//   //"Which is smaller? The biggest value, or the upper limit?"
//   //if the biggest value is smaller, then return that because it's under the limit
//   //Otherwise, return the upper limit
//   return (Math.min(max, Math.max(min, v)));
//   //Condense that all into one line
// }
