let player, bullets, rocks;
let up, down, left, right, space;

let cp;

const PLAYER = 0;
const ROCK = 1;
const ROCKPOINTS = 2;

function setup() {
  createCanvas(700, 700);
  angleMode(RADIANS);
  bullets = [];
  rocks = [];
  cp = [];

  for (let i = 0; i < 10; i++) {
    rocks.push(new Asteroid(random(width), random(height), int(random(1, 5))));
    rocks[i].num = i;
  }

  player = new Player();
}

function draw() {
  background(0);

  player.update();
  player.show();

  for (let i = 0; i < rocks.length; i++) {
    rocks[i].update();
  }

  cp = closest();

  for (let i = 0; i < rocks.length; i++) {
    rocks[i].show();
  }

  for (let i = 0; i < bullets.length; i++) {
    bullets[i].update();
    bullets[i].show();
    if (bullets[i].timeAlive >= frameRate() * 10) bullets.splice(i, 1);
  }

  // stroke(255);
  // strokeWeight(1);
  // let playerX = player.points[cp[PLAYER]].x + player.pos.x;
  // let playerY = player.points[cp[PLAYER]].y + player.pos.y;
  // let rock1X = rocks[cp[ROCK]].points[cp[ROCKPOINTS][0]].x + rocks[cp[ROCK]].pos.x;
  // let rock1Y = rocks[cp[ROCK]].points[cp[ROCKPOINTS][0]].x + rocks[cp[ROCK]].pos.y;
  // let rock2X = rocks[cp[ROCK]].points[cp[ROCKPOINTS][1]].x + rocks[cp[ROCK]].pos.x;
  // let rock2Y = rocks[cp[ROCK]].points[cp[ROCKPOINTS][1]].x + rocks[cp[ROCK]].pos.y;
  // line(playerX, playerY, rock1X, rock1Y);
  // line(playerX, playerY, rock2X, rock2Y);

}

function closest() {
  let dists = [];
  let closestRock, closestRockPoint, secondClosestRockPoint, closestPlayerPoint;
  for (let i = 0; i < rocks.length; i++) {
    for (let j = 0; j < rocks[i].points.length; j++) {
      for (let k = 0; k < player.points.length; k++) {
        let curDist = dist(
          rocks[i].pos.x + rocks[i].points[j].x,
          rocks[i].pos.y + rocks[i].points[j].y,
          player.pos.x + player.points[k].x,
          player.pos.y + player.points[k].y
        );
        dists.push(curDist);
        if (curDist == min(dists)) {
          closestRock = i;
          if (closestRockPoint) secondClosestRockPoint = closestRockPoint;
          closestRockPoint = j;
          closestPlayerPoint = k;
        }
      }
    }
  }
  return [closestPlayerPoint, closestRock, [closestRockPoint, secondClosestRockPoint]];
}

function keyPressed() {
  if (keyCode === UP_ARROW || keyCode === 87) up = true;
  if (keyCode === DOWN_ARROW || keyCode === 83) down = true;
  if (keyCode === LEFT_ARROW || keyCode === 65) left = true;
  if (keyCode === RIGHT_ARROW || keyCode === 68) right = true;
  if (keyCode === 32) space = true;
}

function keyReleased() {
  if (keyCode === UP_ARROW || keyCode === 87) up = false;
  if (keyCode === DOWN_ARROW || keyCode === 83) down = false;
  if (keyCode === LEFT_ARROW || keyCode === 65) left = false;
  if (keyCode === RIGHT_ARROW || keyCode === 68) right = false;
  if (keyCode === 32) space = false;
}

function pointInAsteroid(point, asteroid) {
  let a, b;
  let ap1 = asteroid.points[cp[ROCKPOINTS][0]]; //first closest
  let ap2 = asteroid.points[cp[ROCKPOINTS][1]]; //second closest
  if (ap1.x <= ap2.x) { //figure out which is the eariler X
    a = ap1;
    b = ap2;
  } else {
    a = ap2;
    b = ap1;
  }

  function EQ(x) { //define the equation of the line
    ((b.y-a.y)/(b.x-a.x))*(x)+(a.y-((b.y-a.y)/(b.x-a.x))*(a.x));
  }

  // if ()

}
