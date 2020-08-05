function playGame() {

	// Hide the introductory elements
	startBtn.style.visibility = 'hidden';
	document.querySelector('.controls').style.visibility = 'hidden';


	// Setting up the canvas

	const canvas = document.querySelector("canvas");
	const ctx = canvas.getContext("2d");
	const width = (canvas.width = window.innerWidth);
	const height = (canvas.height = window.innerHeight);

	// Grab other HTML elements
	const scores = document.querySelector(".scores");
	const life = document.querySelector('.life');
	const winLose = document.querySelector('.win-or-lose');
	winLose.style.visibility = 'hidden';

	// Define two animation variables
	let rAF;
	let myInterval;

	// The function to generate the random number when needed
	function random(min, max) {
	  const num = Math.floor(Math.random() * (max - min)) + min;
	  return num;
	}

	// Define the brick constructor

	function Brick(x, y, width, height, color) {
	  this.x = x;
	  this.y = y;
	  this.width = width;
	  this.height = height;
	  this.color = color;
	}

	// Define the Brick draw method
	Brick.prototype.draw = function () {
	  ctx.fillStyle = this.color;
	  ctx.fillRect(this.x, this.y, this.width, this.height);
	};

	// Define the Bar constructor that inherits from the brick
	function Bar(x, y, width, height, velocityX, velocityY, color) {
	  Brick.call(this, x, y, width, height, color);
	  this.velocityX = velocityX;
	  this.velocityY = velocityY;
	}

	Bar.prototype = Object.create(Brick.prototype);

	Object.defineProperty(Brick.prototype, "constructor", {
	  value: Bar,
	  enumerable: false,
	  writable: true,
	});

	// Move the Bar

	Bar.prototype.moveLeft = function () {
	  if (this.x > 0) {
	    this.x -= this.velocityX;
	  }
	};

	Bar.prototype.moveRight = function () {
	  if (this.x + this.width < width) {
	    this.x += this.velocityX;
	  }
	};

	// Set Bar key board controls
	function setControls() {
	  window.onkeydown = (e) => {
	    if (e.key === "ArrowLeft") {
	      bar.moveLeft();
	    } else if (e.key === "ArrowRight") {
	      bar.moveRight();
	    }
	  };
	}

	// Define the Ball constructor

	function Ball(x, y, velocityX, velocityY, color, size) {
	  this.x = x;
	  this.y = y;
	  this.velocityX = velocityX;
	  this.velocityY = velocityY;
	  this.color = color;
	  this.size = size;
	}

	// Define the Ball draw method

	Ball.prototype.draw = function () {
	  ctx.beginPath();
	  ctx.fillStyle = this.color;
	  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
	  ctx.fill();
	};

	// Define the Ball update method

	let lives = 3;
	let randomTakeOffX = Math.random() > 0.5 ? random(-4, -6) : random(4, 6);

	Ball.prototype.update = function () {
	  // Generate some random direction
	  randomDir = random(-4, -6);
	  randomSpeed = Math.random();

	  // Check the collision with the bar
	  if (
	    this.x - this.size < bar.x + bar.width &&
	    this.x + this.size > bar.x &&
	    this.y + this.size > bar.y
	  ) {
	    this.velocityY = -(this.velocityY +randomSpeed);
	    bar.color = this.color;
	    bar.velocityX +=randomSpeed;
	  }

	  // Check the left side, right side, and top part
	  // of the screen and bounce the ball back

	  if (this.x - this.size <= 0) {
	    this.velocityX = -this.velocityX;
	  }

	  if (this.x + this.size >= width) {
	    this.velocityX = -this.velocityX;
	  }

	  if (this.y - this.size <= 0) {
	    this.velocityY = -this.velocityY;
	  }

	  if(this.y + this.size >= height) {
	  	this.x = width / 2;
	  	this.y = height - 50;
	  	this.velocityX = randomTakeOffX;
	  	this.velocityY = randomDir;
	  	lives--;
	  }

	  // Move the ball
	  this.x += this.velocityX;
	  this.y += this.velocityY;
	};

	// Check Ball's collision with the Bricks
	let marks = 0;
	Ball.prototype.checkCollision = function () {
	  for (let j = 0; j < bricks.length; j++) {
	    if (
	      this.x + this.size > bricks[j].x &&
	      this.x - this.size < bricks[j].x + bricks[j].width &&
	      this.y + this.size <= bricks[j].y + bricks[j].height
	    ) {
	      marks++;
	      this.velocityY = -this.velocityY;
	      this.color = bricks[j].color;
	      bricks.splice(j, 1);
	    }
	  }
	};

	// Define the array to store the bricks and populate them
	let bricks = [];
	let brickWidth = width / 10 - 10;
	let brickHeight = height / 10;
	let brickX = -(brickWidth + 5);
	let brickY = 10;
	let brick;
	while (bricks.length < 30) {
	  if (bricks.length === 10) {
	    brickY += brickHeight + 10;
	    brickX = -(brickWidth + 5);
	  }

	  if (bricks.length === 20) {
	    brickY += brickHeight + 10;
	    brickX = -(brickWidth + 5);
	  }
	  brickX += brickWidth + 10;
	  brick = new Brick(
	    brickX,
	    brickY,
	    brickWidth,
	    brickHeight,
	    `rgb(${random(50, 255)}, ${random(50, 255)}, ${random(50, 255)})`
	  );
	  bricks.push(brick);
	}

	let bar = new Bar(
	  width / 2 - width / 10,
	  height - 20,
	  width / 5,
	  20,
	  20,
	  0,
	  "white"
	);

	// Draw the ball
	let ball = new Ball(width / 2, height - 50, randomTakeOffX, random(-4, -6), "rgb(255, 255, 255)", 10);

	// Define the function to always loop the game

	setControls();

	function loopGame() {
	  ctx.fillRect(0, 0, 0, 0);

	  ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
	  ctx.fillRect(0, 0, width, height);

	  for (let i = 0; i < bricks.length; i++) {
	    bricks[i].draw();
	  }

	  scores.style.color = bar.color;
	  scores.textContent = marks > 9 ? marks : `0${marks}`;
	  life.style.color = bar.color;
	  life.textContent = lives;

	  bar.draw();

	  ball.draw();
	  ball.update();
	  ball.checkCollision();

	  rAF = requestAnimationFrame(loopGame);

	  if (marks >= 30) {
	  	scores.textContent = marks > 9 ? marks : `0${marks}`;
	  	life.textContent = lives;
	  	cancelAnimationFrame(rAF);
	  	winLose.textContent = 'You won';
	  	startBtn.style.visibility = 'visible';
	  	winLose.style.visibility = 'visible';
	  }

	  if (lives === 0) {
	  	scores.textContent = marks > 9 ? marks : `0${marks}`;
	  	life.textContent = lives;
	  	cancelAnimationFrame(rAF);
	  	winLose.textContent = 'You lost';
	  	startBtn.style.visibility = 'visible';
	  	winLose.style.visibility = 'visible';
	  }
	}

	loopGame();
}


const startBtn = document.querySelector('.startbtn');
startBtn.addEventListener('click', playGame);