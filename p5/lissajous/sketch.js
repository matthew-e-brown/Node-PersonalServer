const gridSize = 8;

let grid, circTop, circLeft;
let pointWeight, strokeThin, strokeThick;

function setup() {
  createCanvas(600, 600);
  angleMode(DEGREES);

  circTop = new Array(gridSize);
  circLeft = new Array(circTop.length);
  let Sx = (width/circTop.length);
  let Sy = (height/circLeft.length);
  let spacing = (width - Sx*2) / circTop.length;
  for (let i = 0; i < circTop.length; i++) {
    circTop[i] = new Circle(Sx + (spacing * (i + 1)), Sy, spacing / 4, 1 * 0.5* (i + 1));
  }
  for (let i = 0; i < circLeft.length; i++) {
    circLeft[i] = new Circle(Sx, Sy + (spacing * (i + 1)), spacing / 4, 1 * 0.5 * (i + 1));
  }

  grid = make2DArray(circTop.length, circTop.length);
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      grid[i][j] = new Shape(map(i*j, (grid.length-1)*(grid[i].length-1), 0, 345, 0));
    }
  }
pointWeight = map(circTop.length, 3, 25, 5, 1);
strokeThin = map(circTop.length, 3, 25, 1, 0.25);
strokeThick = map(circTop.length, 3, 25, 1.5, 0.5)
}

function draw() {
  background(20);

  [circTop, circLeft].forEach((circles) => {
    circles.forEach((circle) => {
      circle.update();
      circle.show();
    });
  });

  if (circTop[0].angle < (-90 - 360)) {
    restore();
  }

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      let x = circTop[i].point.x;
      let y = circLeft[j].point.y;
      stroke(100, 25);
      strokeWeight(strokeThin);
      line(x, 0, x, height);
      line(0, y, width, y)

      stroke(255);
      strokeWeight(pointWeight);
      point(x, y);

      if (frameCount % 2 == 0) grid[i][j].addPoint(x, y);
    }
  }

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      grid[i][j].show();
    }
  }

}

function restore() {
  [circTop, circLeft].forEach((list) => {
    list.forEach((circle) => {
      circle.angle = -90;
    });
  });
  grid.forEach((row) => {
    row.forEach((shape) => {
      // shape.points = [];
      shape.x = [];
      shape.y = [];
    });
  });
}

function make2DArray(rows, cols) {
  let array = new Array(rows);
  for (let i = 0; i < array.length; i++) {
    array[i] = new Array(cols);
  }
  return array;
}
