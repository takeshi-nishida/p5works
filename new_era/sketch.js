let font;
let points, poly;
let bounds;
let balls;

const word = "欅坂"

function preload(){
 font = loadFont("NotoSansCJKjp-Regular.otf");
}

function setup(){
  createCanvas(windowWidth, windowHeight);
  points = font.textToPoints(word, 0, 0, 64, {
    sampleFactor: 1,
    simplifyThreshold: 0
  });
  bounds = font.textBounds(word, 0, 0, 64);
  poly = points.map(p => translatePoint(p));
  balls = [];
  noStroke();
  colorMode(HSB);

  // for(let i = 0; i < 1000; i++){
  //   const x = random(0, width);
  //   const y = random(0, height);
  //   const angle = random(0, TWO_PI);
  //   const vx = cos(angle) * 10;
  //   const vy = sin(angle) * 10;
  //   const size = random(10, 20);
  //   balls.push(randomColorBall(x, y, vx, vy, size));
  // }

}

function draw(){
  background(0);

  // drawPoly();

  for(let i = 0; i < balls.length; i++){
    const b = balls[i];
    const hit = collidePointPoly(b.x, b.y, poly);
    const dcolor = abs(hue(b.c) - 114) / 360;
    const f = hit ? dcolor * 0.1 + 0.01 : 1;
    animateBall(b, f);
    drawBall(b);
  }

  balls = balls.filter(b => b.r > 4);

  const n = 3;
  for(let i = 0; i < n; i++){
    const x = width * (i + 1) / (n + 1);
    const y = sin(millis() % 1000) * height + height;
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

function drawPoly(){
  beginShape();
  for(let i = 0; i < poly.length; i++){
    const p = poly[i];
    vertex(p.x, p.y);
  }
  endShape();
}

function randomColorBall(x, y, vx, vy, r){
  const c = color(random(360), 55, 73, 0.5);
  return { x, y, vx, vy, r, c };
}

function mouseDragged(){
  const vx = mouseX - pmouseX;
  const vy = mouseY - pmouseY;
  balls.push(randomColorBall(mouseX, mouseY, vx, vy, 10));
}

function translatePoint(p){
  const x = (p.x - bounds.x) * width / bounds.w;
  const y = (p.y - bounds.y) * height / bounds.h;
  return createVector(x, y);
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
  poly = points.map(p => translatePoint(p));
}
