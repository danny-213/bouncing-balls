

// SETUP CANVAS

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

// HELPER FUNCTION to generate random number

function random(min, max) {
  const num = Math.floor(Math.random() * (max - min + 1)) + min;
  return num;
}

// HELPER FUNCTION 
// takes in 2 Shape Objects, true if they touch each other 

function collide (ball1,ball2) {
  const dx = ball1.x - ball2.x;
  const dy = ball1.y - ball2.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  return distance < ball1.size + ball2.size;

}





// DEFINING SHAPE OBJECT
  // Ball and Evil circle inherit from 
  // Shape Object can draw(), update() and collisionDetect()

function Shape(x, y, velX, velY, exists) {
  this.x = x;
  this.y = y;
  this.velX = velX;
  this.velY = velY;
  this.exists = exists;
}


  // draw Shape based on their properties: coordinates (x,y), color, size
Shape.prototype.draw = function() {
  
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
  
}

  // constantly checking object touch the walls and update their positions via velX, velY

Shape.prototype.update = function() {
  if ((this.x + this.size) >= width) { //touch right wall
    this.velX = -(this.velX); //change direction 
  }

  if ((this.x - this.size) <= 0) {//touch left wall
    this.velX = -(this.velX);
  }

  if ((this.y + this.size) >= height) {//touch bottom wall
    this.velY = -(this.velY);
  }

  if ((this.y - this.size) <= 0) {//touch top wall
    this.velY = -(this.velY);
  }

  this.x += this.velX;
  this.y += this.velY;
}

// when detect a collision, change the Shapes' color


Shape.prototype.collisionDetect = function() {
  //compare invoked ball with the rest to see if they collide
  for (let j = 0; j < balls.length; j++) {
    if (!(this === balls[j]) && balls[j].exists) {
      

      if (collide(this,balls[j])) {
        balls[j].color = this.color = 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) +')';
      }
    }
  }
}





// CREATING BALL OBJECT 


function Ball(x, y, velX, velY, exists, color, size) {
  Shape.call(this, x, y, velX, velY, exists);
  this.color = color;
  this.size = size;
}

// appropriate constructor for Ball
Ball.prototype.constructor = Ball;
  // Ball's prototype inherit from Shape's prototype
Ball.prototype = Object.create(Shape.prototype);



// DEFINING EVILCIRCLE

function EvilCircle (x, y, velX, velY, exists) {
  Shape.call(this, x, y, 20, 20, exists);
  this.color = 'rgb(255,255,255)';
  this.size = 10;
}
EvilCircle.prototype.constructor = EvilCircle;

EvilCircle.prototype = Object.create(Shape.prototype);


EvilCircle.prototype.draw = function() {
  
  ctx.beginPath();
  ctx.strokeStyle = this.color;
  ctx.lineWidth = 6;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.stroke();
}

EvilCircle.prototype.setControl = function() {
  let _this = this;
  window.onkeydown = function (e) {
    if (e.key === 'a') {
      
      _this.x -= _this.velX;
    } else if (e.key === 'd') {
      
      _this.x += _this.velX;
    } else if (e.key === 'w') {
      
      _this.y -= _this.velY;
    } else if (e.key === 's') {
      
      _this.y += _this.velY;
    }
  }
}

EvilCircle.prototype.setRandomColor = function() {


  this.color='rgb(' + random(0,255) + ',' + random(0,255) + ',' + random(0,255) +')';

}

EvilCircle.prototype.checkBounds = function() {


  // instead of limiting controls, create a little bounce off animation to let user know they cant go there
  // GOOD POINT !!!

  let BOUNCE_OFF_DISTANCE = 8;
  let currentSize =this.size;
  let addSize = this.size + 10;

 

  
  if ((this.x + this.size) >= width) { //touch right wall
    this.x -= BOUNCE_OFF_DISTANCE;
    
  }

  if ((this.x - this.size) <= 0) {//touch left wall
    this.x += BOUNCE_OFF_DISTANCE;
    
  }

  if ((this.y + this.size) >= height) {//touch bottom wall
    this.y -= BOUNCE_OFF_DISTANCE;
    
  }

  if ((this.y - this.size) <= 0) {//touch top wall
    
    this.size = currentSize/2;
    this.y += BOUNCE_OFF_DISTANCE;
  }
  
  this.size = currentSize;
  

}

// define different detectcollision
// EvilCircle.prototype.collisionDetect = function() {
  


EvilCircle.prototype.collisionDetect = function() {
  
  for (let j = 0; j < balls.length; j++) {
    if (balls[j].exists) {
      if (collide(this,balls[j])) {
        
        balls[j].exists = false;
       
        this.size += balls[j].size/10; //evilCircle gets larger after eating the balls
        
        
      }
    }
  }
}

// CREATING BALLS LIST 

const balls = [];
let maxBallNumber = 27;

while (balls.length < maxBallNumber) {
  let size = random(5,25);

  let ball = new Ball(
    // ball position always drawn at least one ball width
    // away from the edge of the canvas, to avoid drawing errors
    random(0 + size,width - size), 
    random(0 + size,height - size),
    random(-7,7),
    random(-7,7),
    true,
    'rgb(' + random(0,255) + ',' + random(0,255) + ',' + random(0,255) +')',
    size
  );
  
  balls.push(ball);
}



evilCirle = new EvilCircle (100, 100,20,20, true);
evilCirle.setControl();

//implement POINT COUNTER i.e. balls that dont exists


let counterElement = document.querySelector('p');





// MAIN GAME LOOP

function loop() {

  

  //recheck the number of balls left after each frame
  let ballLeft = 0;
  counterElement.innerText = 'Point counter: ';
  
  // at every each new frame, repaint the context canvas
  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)'; 
  ctx.fillRect(0, 0, width, height);
  

  // draw ball with new position AND THEN update balls' position 
  // maybe this is the reason why we can see the blur motion behind
  for (let i = 0; i < balls.length; i++) {
    
    if (balls[i].exists){
      balls[i].draw();
      balls[i].update();
      balls[i].collisionDetect();
      ballLeft ++
      
    }

    
    evilCirle.setRandomColor();
    evilCirle.draw();
    evilCirle.checkBounds();
    evilCirle.collisionDetect();
    
    
    
    

  }
  
  let pts = balls.length - ballLeft;
  addingTxt = ' ' + pts.toString();
  counterElement.innerText += addingTxt;
  

  requestAnimationFrame(loop);
}

loop();