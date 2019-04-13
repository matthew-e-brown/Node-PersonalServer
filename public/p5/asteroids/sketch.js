/* ASTEROIDS - MATTHEW BROWN - http://www.matthew-e-brown.com/
 * Created October 20th, 2018, ~12:00pm until October 25th, 2018, ~4:35PM
 * A recreation of the classic Atari 1979 arcade game. */

/* My high score is: 31700 on wave 6 */

/* Boolean variables which are set to true when
 * their respective keys are held down, and false
 * when they're released. */

let up, down, left, right, space, enter;
let player; /* Holds the main player object. */

let mainFont;

let debug = false; /* If set to true, debug graphics are shown */
let lastAcc, lastImpact;

let rocks;
let bullets;
let explosions;

let score, lastAwarded, timesAwarded;
let wave;
let waveWait = false;

let mainGame, gameOver, mainMenu, helpScreen;
let buttonBegin, buttonRetry, buttonHelp, buttonBack;
let paused;

let bangLarge, bangMedium, bangSmall, extraShip, fire, thrust;
let mute;
let soundon, soundoff;

/* These variables are used to make it easier to
 * define things in arrays. i.e. it's eaiser to
 * set and call array[LEFT] than it is to
 * remember which index of the array coincides
 * with left. */
const UPSIDE = 0;
const DOWNSIDE = 1;
const LEFTSIDE = 2;
const RIGHTSIDE = 3;
const NUMPOINTS = 0;
const FIRST = 1;
const SECOND = 2;

function setup() {
  createCanvas(700, 700);
  angleMode(DEGREES);

  mainFont = loadFont("ProFontWindows.ttf")
  textFont(mainFont);

  soundFormats('wav');
  bangLarge = loadSound("sounds/bangLarge.wav");
  bangMedium = loadSound("sounds/bangMedium.wav");
  bangSmall = loadSound("sounds/bangSmall.wav");
  extraShip = loadSound("sounds/extraShip.wav");
  shoot = loadSound("sounds/fire.wav");
  thrust = loadSound("sounds/thrust.wav");

  bangLarge.setVolume(0.7);
  bangMedium.setVolume(0.6);
  bangSmall.setVolume(0.6);
  extraShip.setVolume(0.6);
  shoot.setVolume(0.5);
  shoot.playMode("restart")
  thrust.setVolume(0.3);
  thrust.playMode("restart");

  mute = false;
  soundon = loadImage("SoundOn-25px.png");
  soundoff = loadImage("SoundOff-25px.png");

  mainGame = false;
  gameOver = false;
  helpScreen = false;
  mainMenu = true;

  player = new Player(width / 2, height * 3 / 4, 30, 40);

  startGame(false);

  buttonBegin = new Button("Start Game", width / 2, height / 2, 300, 50);
  buttonRetry = new Button("Back to Menu", width / 2, height / 2, 300, 50);
  buttonHelp = new Button("How to Play", width / 2, height / 2 + 75, 300, 50);
  buttonBack = new Button("Back to Menu", width / 2, height * 8 / 9, 300, 50);
}

function draw() {
  background(0);

  if (helpScreen) {
    player.update();
    player.show();

    for (let i = 0; i < bullets.length; i++) {
      if (bullets[i].distTravelled > width * 0.40) bullets.splice(i, 1);
      if (bullets[i] !== undefined) {
        bullets[i].update();
        bullets[i].show();
      }
    }

    buttonBack.show(enter);
    textSize(52);
    textAlign(CENTER, BOTTOM);
    text("HOW TO PLAY", width / 2, height / 4);
    textSize(14);
    textAlign(RIGHT, CENTER);
    text("W or Up ..\n\nA/D or L/R-Arrow ..\n\nS or Down ..\n\nSpace or Z ..\n\nM ..\n\nEnter ..", width / 2, height / 2 - 40);
    textAlign(LEFT, CENTER);
    text(".. Accelerate\n\n.. Rotate\n\n.. Brake\n\n.. Fire\n\n.. Mute\n\n.. Pause", width / 2, height / 2 - 40);
    textSize(12);
    textAlign(CENTER, CENTER);
    text("Fly around and destroy all the asteroids on the screen.\n" +
      "There are 12 asteroids to being with, plus two for every new wave you reach." +
      "\nThings wrap around the edge of the screen." +
      "\n\nYou earn an extra life every wave, plus every 5000 points, up to a maximum of ten." +
      "\nYou start with five.",
      width / 2, height * 3 / 4 - 35);
  }

  if (mainMenu) {
    player.update();
    player.show();

    for (let i = 0; i < bullets.length; i++) {
      if (bullets[i].distTravelled > width * 0.40) bullets.splice(i, 1);
      if (bullets[i] !== undefined) {
        bullets[i].update();
        bullets[i].show();
      }
    }

    stroke(0);
    strokeWeight(2);
    fill(255);
    textSize(52);
    textAlign(CENTER, BOTTOM);
    text("ASTEROIDS", width / 2, height / 4);
    textAlign(CENTER, TOP);
    textSize(14);
    text("A recreation by Matthew Brown\nOct. 20th - 25th, 2018", width / 2, height / 4 + 50);
    buttonBegin.show(enter);
    buttonHelp.show();
    textAlign(CENTER, BOTTOM);
    textSize(8);
    text("Code by Matthew Brown. Some libraries used.\nSounds from www.classicgaming.cc/classics/asteroids/sounds/.", width / 2, height - 8);
  }

  /* ---------- START OF MAIN GAME LOOP ---------- */
  if (mainGame) {
    if (!paused) {
      for (let i = 0; i < rocks.length; i++) {
        rocks[i].update();
        rocks[i].show();
      }
      player.update();
      player.show();
      player.health = constrain(player.health, 0, 10);

      /* Draw the player's health */
      let w = 15;
      let h = 20;
      fill(0);
      stroke(255);
      strokeWeight(1);
      push();
      translate(25, 55);
      for (let i = 0; i < player.health; i++) {
        beginShape();
        vertex(0, -h * 0.5);
        vertex(-w * 0.5, h * 0.5);
        vertex(0, h * 0.365);
        vertex(w * 0.5, h * 0.5);
        endShape(CLOSE);
        /* Accumulate the Transitions */
        translate(25, 0);
      }
      pop();

      /* Draw the Score */
      fill(255);
      stroke(0);
      strokeWeight(2);
      textSize(18);
      textAlign(LEFT, CENTER)
      text(score.toString().padStart(7, '0'), 20, 25);
      textAlign(RIGHT, CENTER);
      textSize(18);
      text("Wave " + wave.toString().padStart(3, '0'), width - 20, 25);
      textSize(14);
      textAlign(RIGHT, TOP);
      text(rocks.length.toString().padStart(2, '0') + " Asteroids", width - 20, 40);

      /* --- PLAYER WITH ASTEROIDS --- */
      for (let r = 0; r < rocks.length; r++) {
        if (nearby(player, rocks[r])) {
          let rock = rocks[r];
          /* Instead of using collidePolyPoly, I'll use collideLinePoly.
           * That way I can use some trig to find the angle of the line
           * that the ship hits, and then reflect the velocity appropriately */
          /* In the event that two polygons collide (unless they are parallel,
           * which is extremely unlikely in my floating poitn world), there will
           * always be one point (two lines meeting) through a single line. */
          let rockData = [
              0, /* The number of lines that the other poly intersects */
              [undefined, undefined], /* The indecies of the two points that make up said line */
              [undefined, undefined] /* The same but for the second point */
            ],
            playerData = [
              0, /* The number of lines that the other poly intersects */
              [undefined, undefined], /* The indecies of the two points that make up said line */
              [undefined, undefined] /* The same but for the second point */
            ];

          rockLoop:
            for (let i = 0; i < rock.points.length; i++) {
              let j = (rock.points[i + 1] === undefined) ? 0 : i + 1; /* returns zero if i is at the end of the list */
              if (collideLinePoly(rock.points[i].x, rock.points[i].y, rock.points[j].x, rock.points[j].y, player.points)) {
                if (rockData[NUMPOINTS] >= 2) break rockLoop;
                rockData[NUMPOINTS]++;
                if (rockData[FIRST][0] === undefined) {
                  rockData[FIRST][0] = i;
                  rockData[FIRST][1] = j;
                } else {
                  rockData[SECOND][0] = i;
                  rockData[SECOND][1] = j;
                }
                if (debug) {
                  stroke(255, 128, 0);
                  strokeWeight(2.25);
                  line(rock.points[i].x, rock.points[i].y, rock.points[j].x, rock.points[j].y);
                }
              }
            }
          playerLoop:
            for (let i = 0; i < player.points.length; i++) {
              let j = (player.points[i + 1] === undefined) ? 0 : i + 1; /* returns zero if i is at the end of the list */
              if (collideLinePoly(player.points[i].x, player.points[i].y, player.points[j].x, player.points[j].y, rock.points)) {
                if (playerData[NUMPOINTS] >= 2) break playerLoop;
                playerData[NUMPOINTS]++
                if (playerData[FIRST][0] === undefined) {
                  playerData[FIRST][0] = i;
                  playerData[FIRST][1] = j;
                } else {
                  playerData[SECOND][0] = i;
                  playerData[SECOND][1] = j;
                }
                if (debug) {
                  stroke(255, 128, 0);
                  strokeWeight(2.25);
                  line(player.points[i].x, player.points[i].y, player.points[j].x, player.points[j].y);
                }
              }
            }
          /* "If the player has two lines that intersect with a rock, then define the line" */
          if (!(playerData[FIRST][0] === undefined) && !(rockData[FIRST][0] === undefined)) {
            let i1, i2;
            if (playerData[NUMPOINTS] == 2 /*If the player hits its point*/ ) {
              /* Set the impact points equal to the Vectors at the index of the single
               * line that the rock has set for it */
              i1 = rock.points[rockData[FIRST][0]];
              i2 = rock.points[rockData[FIRST][1]];
            } else if (rockData[NUMPOINTS] == 2) {
              i1 = player.points[playerData[FIRST][0]];
              i2 = player.points[playerData[FIRST][1]];
            }
            /* So now, i2 and i1 are Vectors which hold the x-y coords of the line that the player
             * hit. Let's draw it to make sure: */
            if (debug) {
              strokeWeight(3);
              stroke(255, 0, 128);
              line(i1.x, i1.y, i2.x, i2.y);

              strokeWeight(8);
              stroke(255, 0, 0);
              point(i1.x, i1.y);
              stroke(0, 0, 255);
              point(i2.x, i2.y);
            }
            /* Now we just need to apply a large force to the velocity of the
             * player that is normal to that line. */
            let impact = i2.copy().sub(i1).normalize();
            /* If I get a unit vector INTO the screen, then the cross product
             * of that and the impact vector should be the desired acceleration
             * vector. */
            let temp = createVector(0, 0, 1);
            let acc = impact.copy().cross(temp);

            /* Used for debug, but still needs to be written every time */
            lastAcc = acc.copy();
            lastImpact = impact.copy();

            acc.setMag(1.45);
            player.pos.add(acc.copy().setMag(2.5));
            player.vel.add(acc);
            if (!player.grace) {
              player.hit();
              if (!mute) {
                bangSmall.play();
                // bangMedium.play();
              }
            }
          }
        }
      }
      /* ---- END OF PLAYER WITH ROCKS ---- */

      if (player.health == 0) {
        if (!mute) {
          bangSmall.play();
          bangMedium.play();
          bangLarge.play();
        }
        explosions.push(new Explosion(player.pos.x, player.pos.y));
        mainGame = false;
        gameOver = true;
      }

      if (score >= 5000 * (timesAwarded + 1)) {
        timesAwarded++;
        lastAwarded = score;
        if (!mute) extraShip.play();
        player.health++;
      }

      if (!waveWait && rocks.length == 0) {
        waveWait = true;
        setTimeout(() => {
          wave++;
          newWave(12 + (2 * (wave - 1)));
          if (!mute) extraShip.play();
          waveWait = false;
        }, 2000);
      }

      /* ---- BULLETS WITH ROCKS ---- */
      for (let i = 0; i < bullets.length; i++) {
        if (bullets[i].distTravelled > width * 0.40) bullets.splice(i, 1);
        if (!(bullets[i] === undefined)) {
          bullets[i].update();
          bullets[i].show();
          rockCheck:
            for (let j = 0; j < rocks.length; j++) {
              let end = bullets[i].pos.copy().sub(bullets[i].vel.copy().setMag(bullets[i].vel.mag() * 0.75));
              let start = bullets[i].pos.copy().add(bullets[i].vel.copy().setMag(bullets[i].vel.mag() * 0.75));
              if (collideLinePoly(start.x, start.y, end.x, end.y, rocks[j].points)) {
                bullets.splice(i, 1);
                if (rocks[j].health <= 1) {
                  rocks[j].split();
                  if (!mute) {
                    switch (rocks[j].level) {
                      case 1:
                        bangSmall.play();
                        break;
                      case 2:
                        bangMedium.play();
                        break;
                      case 3:
                        bangLarge.play();
                        break;
                    }
                  }
                  explosions.push(new Explosion(rocks[j].pos.x, rocks[j].pos.y));
                  rocks.splice(j, 1);
                } else {
                  rocks[j].health--;
                }
                break rockCheck;
              }
            }
        }
      }
      /* ---- END OF BULLETS WITH ROCKS ---- */

      for (let i = 0; i < explosions.length; i++) {
        explosions[i].show();
        if (explosions[i].timeAlive > 60) explosions.splice(i, 1);
      }

      /* This draws a little diagram of the last impact that occurred. */
      if (debug) {
        fill(0, 255, 0);
        stroke(0);
        strokeWeight(1);
        textAlign(LEFT);
        textSize(12);
        text("FPS: " + round(frameRate()) +
          "\nNumber of Asteroids: " + rocks.length +
          "\nNumber of Bullets  : " + bullets.length +
          "\nLast-Score Awarded : " + lastAwarded +
          "\nTimes Score-Life++ : " + timesAwarded +
          "\nNext Score-Award   : " + 5000 * (timesAwarded + 1), 20, 110);

        if (!(lastAcc === undefined || lastImpact === undefined)) {
          let dp = createVector(70, height - 70);

          /* Draw the little box: */
          noStroke();
          fill(51);
          rectMode(CENTER);
          rect(dp.x, dp.y, 50, 50);

          /* Draw the line that the impact occured on, including
           * a little extra line to show it's not just a direction,
           * but its own line: */
          stroke(255, 0, 128);
          strokeWeight(1.5);
          line(dp.x - lastImpact.x * 20, dp.y - lastImpact.y * 20, dp.x + lastImpact.x * 20, dp.y + lastImpact.y * 20);
          strokeWeight(2.5);
          stroke(255, 0, 128);
          fill(255, 0, 128);
          drawArrow(dp, lastImpact.copy().mult(20));

          /* Draw the line that the ship was pushed in: */
          stroke(50, 128, 255);
          fill(50, 128, 255);
          drawArrow(dp, lastAcc.copy().mult(20));

          /* Draw the origin for these two vectors: */
          strokeWeight(3.25);
          stroke(255);
          point(dp.x, dp.y);

          /* Add a title to this diagram: */
          stroke(0);
          strokeWeight(1);
          fill(255, 0, 128);
          textAlign(CENTER);
          text("Line of Impact", dp.x, dp.y - 42.5);
          fill(50, 128, 255);
          text("\nAcc. Vector", dp.x, dp.y - 42.5);
        }
      }
    } else {
      textAlign(CENTER, CENTER);
      textSize(52);
      text("PAUSED", width / 2, height / 2);
    }
  }
  /* ---------- END OF MAIN GAME LOOP ---------- */

  if (gameOver) {
    /* Keep the rocks, for effect
     * (for each can be used because we're not gonna splice) */
    rocks.forEach((r) => {
      r.update();
      r.show(false);
    });

    for (let i = 0; i < explosions.length; i++) {
      explosions[i].show();
      if (explosions[i].timeAlive > 60) explosions.splice(i, 1);
    }

    stroke(0);
    strokeWeight(2);
    fill(255);
    textSize(52);
    textAlign(CENTER, BOTTOM);
    text("GAME OVER", width / 2, height / 4);
    textSize(14);
    textAlign(RIGHT, TOP);
    text("Score Achieved \nWave Reached ", width / 2, height / 4 + 60);
    textAlign(LEFT, TOP);
    text("........ " + score.toString().padStart(7, '0') + "\n........ " + wave.toString().padStart(3, '0'), width / 2, height / 4 + 60);
    buttonRetry.show(enter);
  }

  if (mute) {
    image(soundoff, width - 28, height - 28);
  } else {
    image(soundon, width - 28, height - 28);
  }

}

function newWave(rockNum, firstWave = false) {
  rocks = [];
  if (!firstWave) {
    player.health++;
  }
  for (let i = 0; i < rockNum; i++) {
    let x, y;
    do {
      x = random(width);
      y = random(height);
    } while (dist(x, y, player.pos.x, player.pos.y) <= 150);
    rocks.push(new Rock(x, y, ceil(random(3))));
  }
}

/* This uses simple squares to check proximity */
function nearby(obj1, obj2) {
  /* Condense the whole thing into one if statement to
   * make it more memory efficient */
  return (((obj1.Cleft >= obj2.Cleft &&
        obj1.Cleft <= obj2.Cright) ||
      (obj1.Cright <= obj2.Cright &&
        obj1.Cright >= obj2.Cleft)) &&
    ((obj1.Ctop >= obj2.Ctop &&
        obj1.Ctop <= obj2.Cbottom) ||
      (obj1.Cbottom <= obj2.Cbottom &&
        obj1.Cbottom >= obj2.Ctop)));
  // let wid = false,
  //   hei = false;
  // if ((obj1.Cleft >= obj2.Cleft && obj1.Cleft <= obj2.Cright) ||
  //   (obj1.Cright <= obj2.Cright && obj1.Cright >= obj2.Cleft)) wid = true;
  // if ((obj1.Ctop >= obj2.Ctop && obj1.Ctop <= obj2.Cbottom) ||
  //   (obj1.Cbottom <= obj2.Cbottom && obj1.Cbottom >= obj2.Ctop)) hei = true;
  // return (wid && hei);
}

function startGame(new_player = true) {
  if (new_player) player = new Player(width / 2, height / 2, 30, 40);
  rocks = [], bullets = [], explosions = [];
  wave = 1;
  score = 0;
  lastAwarded = 0;
  timesAwarded = 0;
  newWave(wave * 12, true);
}

function keyPressed() {
  if (keyCode === UP_ARROW || keyCode === 87) up = true;
  if (keyCode === DOWN_ARROW || keyCode === 83) down = true;
  if (keyCode === LEFT_ARROW || keyCode === 65) left = true;
  if (keyCode === RIGHT_ARROW || keyCode === 68) right = true;
  if (keyCode === 32 || keyCode === 90) space = true;
  if (keyCode === 192) debug = !debug;
  if (keyCode === 13) {
    if (!mainGame) enter = true;
    else paused = !paused;
  }
  if (keyCode === 77) mute = !mute;
}

function keyReleased() {
  if (keyCode === UP_ARROW || keyCode === 87) up = false;
  if (keyCode === DOWN_ARROW || keyCode === 83) down = false;
  if (keyCode === LEFT_ARROW || keyCode === 65) left = false;
  if (keyCode === RIGHT_ARROW || keyCode === 68) right = false;
  if (keyCode === 32 || keyCode === 90) space = false;
  if (keyCode === 13) {
    if (!mainGame) {
      enter = false;
      if (mainMenu) {
        startGame();
        gameOver = false;
        mainMenu = false;
        mainGame = true;
      } else if (gameOver) {
        startGame(false);
        player = new Player(width / 2, height * 3 / 4, 30, 40);
        gameOver = false;
        mainGame = false;
        mainMenu = true;
      } else if (helpScreen) {
        helpScreen = false;
        mainGame = false;
        gameOver = false;
        mainMenu = true;
      }
    }
  }
}

function mousePressed() {
  if (mainMenu && buttonBegin.mouseOver()) {
    startGame();
    gameOver = false;
    mainMenu = false;
    mainGame = true;
  } else if (gameOver && buttonRetry.mouseOver()) {
    startGame(false);
    player = new Player(width / 2, height * 3 / 4, 30, 40);
    mainGame = false;
    gameOver = false;
    mainMenu = true;
  } else if (mainMenu && buttonHelp.mouseOver()) {
    mainMenu = false;
    mainGame = false;
    gameOver = false;
    helpScreen = true;
  } else if (helpScreen && buttonBack.mouseOver()) {
    helpScreen = false;
    mainGame = false;
    gameOver = false;
    mainMenu = true;
  }
}

function drawArrow(base, vec) {
  /* Shamelessly stolen from the p5.js reference
   * page. This is only used in debug mode, so I
   * don't think it's that big a deal.
   * https://p5js.org/reference/#/p5.Vector/sub */
  push();
  // stroke(myColor);
  // strokeWeight(3);
  // fill(myColor);
  translate(base.x, base.y);
  line(0, 0, vec.x, vec.y);
  rotate(vec.heading());
  let arrowSize = 3.575;
  translate(vec.mag() - arrowSize, 0);
  triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
  pop();
}
