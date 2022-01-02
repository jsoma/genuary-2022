/*
Genuary 2022 - https://genuary.art/prompts
01-01 "Draw 10,000 of something."
*/

const cols = 100;
const rows = 100;

function setup() {
  createCanvas(600, 600);
  colorMode(HSB, 100);
  noLoop();
}

function draw() {
  const hue = random(0, 100);
  const margin = 30;
  noStroke();
  for(let i = 0; i < cols; i++) {
    for(let j = 0; j < rows; j++) {
      const x = map(i, 0, cols, margin, width - margin);
      const y = map(j, 0, rows, margin, height - margin);
      const n = noise(i * 0.05, j * 0.05);
      const d = map(n, 0, 1, 1, 6);
      fill(hue, 50 * n, 100);
      circle(x, y, 5);
    }
  }
}
