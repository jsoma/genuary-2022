/*
Genuary 2022 - https://genuary.art/prompts
01-02 "Dithering."
https://surma.dev/things/ditherpunk/
*/

let img;

function preload() {
  img = loadImage("original.jpg");
}

/*
  pixelDensity(1) because it's so much easier
  than dealing with retina displays. I think if I used it
  I wouldneed to use .get(x, y) instead of pixels[])
*/

function setup() {
  pixelDensity(1);
  createCanvas(600, 600);
  noLoop();
}

/*
  pixels aren't stored as a 2d array, it's just one
  big array! It's auto-populated after you run loadPixels().
  As a result, we live with things like:
    R = pixels[i]
    G = pixels[i+1]
    B = pixels[i+2]
    A = pixels[i+3]
*/

function getColor(i) {
  // If we want pixel n, it starts from nth * 4 bc RGBA
  const actual = 4 * i;
  return color(pixels[actual], pixels[actual + 1], pixels[actual + 2]);
}

function getBrightness(i) {
  // Brightness is 0-100 but I'd prefer 0-1
  return brightness(getColor(i)) / 100;
}

function setPixel(i, color) {
  const actual = 4 * i;
  pixels[actual] = color.levels[0];
  pixels[actual + 1] = color.levels[1];
  pixels[actual + 2] = color.levels[2];
}

function draw() {
  image(img, 0, 0, width, height);
  // https://stackoverflow.com/questions/54707586/getting-pixel-values-of-images-in-p5js
  loadPixels();

  // Doing this manually was painful
  // but you can see the nice versions
  // at https://en.wikipedia.org/wiki/Ordered_dithering#Pre-calculated_threshold_maps
  const mult_2x2 = 1 / 4;
  const bayer2x2 = [
    [0 * mult_2x2, 2 * mult_2x2],
    [3 * mult_2x2, 1 * mult_2x2],
  ];

  const mult_4x4 = 1 / 16;
  const bayer4x4 = [
    [0 * mult_4x4, 8 * mult_4x4, 2 * mult_4x4, 10 * mult_4x4],
    [12 * mult_4x4, 4 * mult_4x4, 14 * mult_4x4, 6 * mult_4x4],
    [3 * mult_4x4, 11 * mult_4x4, 1 * mult_4x4, 9 * mult_4x4],
    [15 * mult_4x4, 7 * mult_4x4, 13 * mult_4x4, 5 * mult_4x4],
  ];

  const thresh = bayer4x4;

  // https://stackoverflow.com/questions/12422407/monochrome-dithering-in-javascript-bayer-atkinson-floyd-steinberg
  for (let i = 0; i < width * height; i++) {
    let x = i % width;
    let y = Math.floor(i / width);
    let bayerThresh = thresh[x % thresh.length][y % thresh.length];

    if (getBrightness(i) > 1 - bayerThresh) {
      setPixel(i, color("white"));
    } else {
      setPixel(i, color("black"));
    }
  }

  updatePixels();
}
