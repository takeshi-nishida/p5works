const words = [" 令和 ", " 元年 ", " 欅坂 ", " ４６ ", " 紅白 ", " ◢ "];

let font;
let points, bounds, poly;
let balls;
let w = 0;

function preload(){
 font = loadFont("NotoSansCJKjp-Regular.otf");
}

function setup(){
  createCanvas(windowWidth, windowHeight);

  points = [];
  bounds = [];
  poly = [];
  for(let i = 0; i < words.length; i++){
    points.push(font.textToPoints(words[i], 0, 0, 64, {
      sampleFactor: 2,
      simplifyThreshold: 0
    }));
    bounds.push(font.textBounds(words[i], 0, 0, 64));
    poly.push(points[i].map(p => translatePoint(p, bounds[i])));
  }

  balls = [];
  noStroke();
  colorMode(HSB);
}

function draw(){
  background(0);

  if(keyIsPressed){
    drawPoly(poly[w]);
    return;
  }

  for(let i = 0; i < balls.length; i++){
    const b = balls[i];
    const hit = collidePointPoly(b.x, b.y, poly[w]);
    const dcolor = abs(hue(b.c) - 114) / 360;
    const d = w % 3 == 2 ? (1 - dcolor) : dcolor;
    const f = hit ? d * 0.08 + 0.01: 1;
    animateBall(b, f);
    drawBall(b);
  }

  balls = balls.filter(b => b.r > 4);

  const n = 3;
  for(let i = 0; i < n; i++){
    const x = width * (i + 1) / (n + 1);
    const y = map(sin(millis() % 1000), -1, 1, 0, 1) * height;
    const angle = random(0, TWO_PI);
    const vx = cos(angle) * 10;
    const vy = sin(angle) * 10;
    const size = random(10, 20);
    balls.push(randomColorBall(x, y, vx, vy, size));
  }
}

function animateBall(b, f){
  let bounced = false;
  b.x += b.vx * f;
  b.y += b.vy * f;
  if(b.x < 0 || b.x > width){
    b.vx *= -1;
    bounced = true;
  }
  if(b.y < 0 || b.y > height){
    b.vy *= -1;
    bounced = true;
  }
  b.x = constrain(b.x, 0, width);
  b.y = constrain(b.y, 0, height);
  if(bounced) b.r *= 0.8;
}

function drawBall(b){
  fill(b.c);
  ellipse(b.x, b.y, b.r);
}

function drawPoly(poly){
  beginShape();
  for(let i = 0; i < poly.length; i++){
    const p = poly[i];
    vertex(p.x, p.y);
  }
  endShape(CLOSE);
}

function randomColorBall(x, y, vx, vy, r){
  const hue = randomGaussian(114, 100);
  const c = color(constrain(hue, 0, 360), 55, 73, 0.8);
  return { x, y, vx, vy, r, c };
}

function mouseDragged(){
  const vx = mouseX - pmouseX;
  const vy = mouseY - pmouseY;
  balls.push(randomColorBall(mouseX, mouseY, vx, vy, 10));
}

function translatePoint(p, bounds){
  const x = (p.x - bounds.x) * width / bounds.w;
  const y = (p.y - bounds.y) * height / bounds.h;
  return createVector(x, y);
}

function mouseClicked(){
  w = (w + 1) % words.length;
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
  poly = points.map(p => translatePoint(p));
}
