const words = [" いつも ", " ありがとう ", " 欅坂46 "];

let font;
let buffers;
let balls;
let w = 0;

function setup(){
  createCanvas(windowWidth, windowHeight);

  buffers = [];
  for(let i = 0; i < words.length; i++){
    buffers.push(createBuffer(words[i]));
  }

  balls = [];
  noStroke();
  colorMode(HSB);
}

function draw(){
  background(0);

  for(let i = 0; i < balls.length; i++){
    const b = balls[i];
    const hit = getBufferColor(buffers[w], b.x, b.y)[3] > 0;
    const dcolor = abs(hue(b.c) - 114) / 360;
    const f = hit ? dcolor * 0.07 + 0.001: 1;
    animateBall(b, f);
    drawBall(b);
  }

  if(frameCount % 1000 == 0) balls = balls.filter(b => b.r > 8);

  if(balls.length < 2000){
    const n = 3;
    for(let i = 0; i < n; i++){
      const x = width * (i + 1) / (n + 1);
      const y = map(sin(millis() % 1000), -1, 1, 0, 1) * height;
      const angle = random(0, TWO_PI);
      const vx = cos(angle) * 10;
      const vy = sin(angle) * 10;
      const size = random(10, 30);
      balls.push(randomColorBall(x, y, vx, vy, size));
    }
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
  if(bounced) b.r *= 0.7;
}

function drawBall(b){
  fill(b.c);
  ellipse(b.x, b.y, b.r);
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

function touchEnded() {
  w = (w + 1) % words.length;
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}

function createBuffer(text){
  push();
  const size = 128;
  textSize(size);
  const w = textWidth(text);
  const h = textDescent() + textAscent();
  const buffer = createGraphics(w, h);
  buffer.textSize(size);
  buffer.textAlign(CENTER, CENTER);
  buffer.text(text, w / 2, h / 2);
  pop();
  return buffer;
}

function getBufferColor(buffer, sx, sy){
  const x = map(sx, 0, width, 0, buffer.width);
  const y = map(sy, 0, height, 0, buffer.height);
  return buffer.get(x, y);
}
