

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






// DEFINING SHAPE OBJECT
  // Ball and Evil circle inherit from 
  // Shape Object can draw(), update() and collisionDetect

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
  if ((this.x + this.size) >= width) {
    this.velX = -(this.velX);
  }

  if ((this.x - this.size) <= 0) {
    this.velX = -(this.velX);
  }

  if ((this.y + this.size) >= height) {
    this.velY = -(this.velY);
  }

  if ((this.y - this.size) <= 0) {
    this.velY = -(this.velY);
  }

  this.x += this.velX;
  this.y += this.velY;
}

// when detect a collision, change the Shapes' color

Shape.prototype.collisionDetect = function() {
  for (let j = 0; j < balls.length; j++) {
    if (!(this === balls[j])) {
      const dx = this.x - balls[j].x;
      const dy = this.y - balls[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.size + balls[j].size) {
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
  // Ball's prototype inherit from Shape's prototype
Ball.prototype = Object.create(Shape.prototype);

Ball.prototype.collisionDetect = function() {
  for (let j = 0; j < balls.length; j++) {
    // check if the ball looping through is itself and exists
    // note: another work around is to delete the element from the list if collide
    if (!(this === balls[j]) && balls[j].exists) {
      const dx = this.x - balls[j].x;
      const dy = this.y - balls[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.size + balls[j].size) {
        // gives the 2 balls same color if collide
        balls[j].color = this.color = 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) +')';
      }
    }
  }
}




// DEFINING EVILCIRCLE

function EvilCircle (x, y, velX, velY, exists) {
  Shape.call(this, x, y, 20, 20, exists);
  this.color = white;
  this.size = 30;
}

EvilCircle.prototype = Object.create(Shape.prototype);


EvilCircle.prototype.draw = function() {
  this.color = 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) +')';
  ctx.beginPath();
  ctx.strokeStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.stroke();
}



// CREATING BALLS LIST 

let balls = [];
let maxBallNumber = 27;

while (balls.length < maxBallNumber) {
  let size = random(10,20);

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









// MAIN GAME LOOP

function loop() {
  // at every each new frame, repaint the context canvas
  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.fillRect(0, 0, width, height);

  // draw ball with new position AND THEN update balls' position 
  // maybe this is the reason why we can see the blur motion behind
  for (let i = 0; i < balls.length; i++) {
    balls[i].draw();
    balls[i].update();
    balls[i].collisionDetect();
  }

  requestAnimationFrame(loop);
}

loop();