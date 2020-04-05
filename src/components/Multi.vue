
<template>
	<v-container class="justify-center pa-0"  fluid fill-height>
		<v-card @click="setGameActive(true)" v-if="!gameActive" class="transparent justify-center align-center text-center">
			<v-card-title class="white--text display-4 level">Level 1</v-card-title>
			<span class="blink">Click to play</span>

		</v-card>
		<canvas id="gameCanvas">
		</canvas>
		<div class="white--text justify-left scoreboard" v-if="gameActive">
			<v-card class="transparent white--text text--center" width="15%">
				<v-card-title class="title">score: {{brickHitCount}}</v-card-title>
			</v-card>
		</div>


		<v-layout class="align-end" v-if="gameActive" fluid>

			<v-progress-linear v-for="blast in blasts" :class="`${blast.class} mx-2 relative`" :key="blast.index" v-model="blast.timer" :background-color="`rgb(255, 165, 0,${blast.backgroundFade})`" :color="`rgb(255, 165, 0, ${blast.fade})`" height="40" reactive>
				<div class="blasttext ml-6 hidden-xs-only"><strong>{{blast.text}}</strong></div>
				<div class="blastimage text-center justify-center absolute">
					<v-img :src="blast.image" alt="image" srcset="" height="40" width="70"></v-img>
				</div>
				<div v-if="blast.extraBall" class="blasttext hidden-xs-only ml-6"><strong>{{blast.counter}}/3</strong></div>
			</v-progress-linear>
		</v-layout>
	</v-container>
</template>

<script>
	import {mapGetters, mapMutations} from "vuex"
    export default {
    name: 'Multi',
    data: () => ({
        canvas: null, 
		canvasContext: null,


		PADDLE_WIDTH: window.innerWidth/15,
		PADDLE_DIST_FROM_EDGE: window.innerHeight/9,
		PADDLE_THICKNESS: window.innerHeight/70,
		paddleX: window.innerWidth/2,
		mouseX: null,
		mouseY: null,

		BRICK_ROWS:10,
		BRICK_COLS: 10,
		BRICK_W: window.innerWidth/10,
		BRICK_H: window.innerHeight/30,
		BRICK_GAP: 2,
		bricksLeft: 0,

		brickGrid: [],
//user stats
		brickDestroyed: 0,

//extra
		goldball: false,
		id:null,
		i:null,
//ball
		ballColor: 'white',
		radius: window.innerHeight/100,

		ballX: window.innerWidth/2,
		ballY: window.innerHeight/3,
		ballSpeedX: window.innerWidth/300,
		ballSpeedY: window.innerWidth/300,
		newBallCount: 1,
		ghostBall: false,
		ballStorage: [
			{id: 0, Xpos: window.innerWidth/2, Ypos: window.innerHeight/3, Xspeed: -window.innerWidth/300, Yspeed: -window.innerHeight/250, radius: window.innerHeight/100, color: "white", reflect: true, active: true},
			{id: 1, Xpos: window.innerWidth/2, Ypos: window.innerHeight/3, Xspeed: 0, Yspeed: -(window.innerHeight/250), radius: window.innerHeight/200, color: "white", reflect: false, active: false},
			{id: 2, Xpos: window.innerWidth/2, Ypos: window.innerHeight/3, Xspeed: 0, Yspeed: -(window.innerHeight/250), radius: window.innerHeight/200, color: "white", reflect: false, active: false},
			{id: 3, Xpos: window.innerWidth/2, Ypos: window.innerHeight/3, Xspeed: 0, Yspeed: -(window.innerHeight/250), radius: window.innerHeight/200, color: "white", reflect: false, active: false},
		],
		balls: [],
//blast
		blasts: [
			{fade:0.01, backgroundFade: 0.5, text: "Q", class: "", timer: 100, timerSpeed: 2, active: false, ballColor: "blue", keyCode: 81, speedBall: true, image: "/speedBall.png"},
			{fade:0.01, backgroundFade: 0.5, text: "W", class: "", timer: 100, timerSpeed: 0.1, active: false, ballColor: "yellow", keyCode: 87, extraBall: true, counter: 0, image: "/damageBall.png"},
			{fade:0.01, backgroundFade: 0.5, text: "E", class: "", timer: 100, timerSpeed: 0.5, active: false, ballColor: "red", keyCode: 69, goldBall: true, image: "/ghostBall.png"},
			{fade:0.01, backgroundFade: 0.5, text: "R", class: "", timer: 100, timerSpeed: 0.05, active: false, ballColor: "yellow", keyCode: 82, starBall: true, image: "/starBall.png"},
		],

		
		brickMove: 0,
		brickHitBall: false,
		brickMoveSpeed: 0.05,
		gamePause: false,
		paddleMenuShuffle: false,
		brickHitCount: 0,
		damage: 0.1,

		keyLeft: false,
		keyRight: false,
		keyDirection: 1,

		//vue bs, irrelevant
		brickAdd: 0,
	}),
	created() {
	window.addEventListener("resize", this.resize);
	},
    mounted(){
    this.canvas = document.getElementById('gameCanvas');
	this.canvasContext = this.canvas.getContext('2d');
	
	let framesPerSecond = 100;

	setInterval(this.updateAll, 1000/framesPerSecond)
	setInterval(this.blastTimer, 100)

    this.canvas.width = window.innerWidth;
	this.canvas.height = window.innerHeight;
	this.canvas.addEventListener('mousemove', this.updateMousePos);
	
	window.addEventListener('keydown', this.keyPress);
	window.addEventListener('keyup', this.keyUp);

	this.ballStorage.forEach(el => {
		if(el.active){
			this.balls.push(el)
		}
	});
	this.brickReset();
	},
	methods: {
		...mapMutations(["setGameActive"]),
		resize(){
			this.canvas.width = window.innerWidth;
			this.canvas.height = window.innerHeight;
			this.radius = window.innerHeight/100,
			this.ballX = window.innerWidth/2,
			this.ballY = window.innerHeight/2,
			this.ballSpeedX = window.innerWidth/300,
			this.ballSpeedY = window.innerHeight/250,
			this.PADDLE_DIST_FROM_EDGE = window.innerHeight/10,
			this.PADDLE_WIDTH = window.innerWidth/15,
			this.PADDLE_THICKNESS = window.innerHeight/70,
			this.BRICK_W = window.innerWidth/10,
			this.BRICK_H = window.innerHeight/30
			this.balls[0].radius = window.innerHeight/100
			this.balls[0].Xpos = window.innerWidth/2
			this.balls[0].Ypos = window.innerHeight/100
		},
		ballReset(ball){
			
			if(ball.id <= 0){
					ball.Xpos = this.canvas.width/2
					ball.Ypos = this.canvas.height/2				
			}else{
				var removeIndex = this.balls.map(function(item) { return item.id; })
									.indexOf(ball.id);
				~removeIndex && this.balls.splice(removeIndex, 1);
			}
		},
		brickReset(){
			let red = 0
			let green = 255
			let blue = 0
			let fade = 1;
			this.brickGrid.length = 0;

	class Brick{ 
		constructor(red, green, blue, fade, exists) {
		this.red = red
		this.green = green
		this.blue = blue
		this.fade = fade
		this.exists = exists
		}
	}
	
	
	for(this.i=0; this.i< 3*this.BRICK_COLS; this.i++){


	let exists = false

    this.brickGrid.push(new Brick(red, green, blue ,fade,exists));
}
	for(; this.i<this.BRICK_COLS * this.BRICK_ROWS; this.i++){

	let fade = 1;
	if(Math.random() > 0.95){
		let exists = true
		this.brickGrid.push(new Brick(red, green, blue ,fade,exists));
	}else{
		let exists = false
		this.brickGrid.push(new Brick(red, green, blue , fade, exists));
	}
}
		},
		updateAll(){
			this.moveAll()
			this.drawAll()
			if(!this.gameActive){
				this.updateMousePosMenu()
			}
			/*this.brickGrid.forEach(el => {
				if(this.brickMove > 10000 && el.exists){
					this.setGameActive(false)
				}
				
			});*/
		},
		updateMousePos(evt){
			if(this.gameActive){
			let rect = this.canvas.getBoundingClientRect();
			let root = document.documentElement;

			this.mouseX = evt.clientX - rect.left - root.scrollLeft
			this.mouseY = evt.clientY - rect.top - root.scrollTop
			/*
			this.balls[0].Xpos = this.mouseX
			this.balls[0].Ypos = this.mouseY
			this.balls[0].Xspeed = -window.innerWidth/300,
			this.balls[0].Yspeed = -window.innerHeight/250*/
			
			this.paddleX = this.mouseX - this.PADDLE_WIDTH/2	
			}
		},
		updateMousePosMenu(){
				if(this.paddleMenuShuffle){
					this.paddleX = this.balls[0].Xpos - this.PADDLE_WIDTH/1.3;
				}else{
					this.paddleX = this.balls[0].Xpos - this.PADDLE_WIDTH/1.2;
				}
		},
		ballMove(){
			this.balls.forEach(ball => {
			ball.Xpos += ball.Xspeed;
			ball.Ypos += ball.Yspeed;

			if(ball.Xpos > this.canvas.width - ball.radius){
				ball.Xspeed *= -1;
			}
			if(ball.Xpos < ball.radius){
				ball.Xspeed *= -1;
			}
			if(ball.Ypos > this.canvas.height - ball.radius){
				this.ballReset(ball)
			}
			if(ball.Ypos < ball.radius){
				ball.Yspeed *= -1
			}
			});

		},
		isBrickAtColRow(col, row) {
			if(col >= 0 && col < this.BRICK_COLS &&
				row >= 0 && row < this.BRICK_ROWS) {
				var brickIndexUnderCoord = this.rowColToArrayIndex(col, row);
				return this.brickGrid[brickIndexUnderCoord].exists;
			} else {
				return false;
			}
		},
		ballBrickHandling(){
			this.balls.forEach(el => {
			var ballBrickCol = Math.floor(el.Xpos / this.BRICK_W);
			var ballBrickRow = Math.floor((el.Ypos - this.brickMove)/ (this.BRICK_H));
			var brickIndexUnderBall = this.rowColToArrayIndex(ballBrickCol, ballBrickRow);
			
			let prevBallX = el.Xpos - el.Xspeed;
			let prevBallY = (el.Ypos - this.brickMove) - el.Yspeed;
			let prevBrickCol = Math.floor(prevBallX / this.BRICK_W)
			let prevBrickRow = Math.floor(prevBallY / this.BRICK_H)

			let col = Math.floor(el.Xpos/this.BRICK_W)
			let prevCol = Math.floor((el.Xpos-el.Xspeed)/this.BRICK_W)			
			
			if(ballBrickCol >= 0 && ballBrickCol < this.BRICK_COLS &&
			ballBrickRow >= 0 && ballBrickRow < this.BRICK_ROWS) {
				if(this.brickGrid[brickIndexUnderBall].exists) {

					if(!this.brickHitBall || col !== prevCol){
					if(el.id > 0){
						this.brickGrid[brickIndexUnderBall].exists = false
						this.ballReset(el);
					}else if(this.ghostBall){
						this.brickGrid[brickIndexUnderBall].fade -= this.damage;
					}else{
					if(this.brickGrid[brickIndexUnderBall].fade > 0.5){
						if(this.goldball){
							this.brickGrid[brickIndexUnderBall].exists = false
							this.brickHitCount += 5;
						}else{
							this.brickGrid[brickIndexUnderBall].fade -= this.damage;
							this.brickHitCount++;
						}
					}else{
						this.brickGrid[brickIndexUnderBall].exists = false
					}
					var bothTestsFailed = true;
			if(prevBrickCol != ballBrickCol) {
					el.Xspeed *= -1;
					bothTestsFailed = false;
			}
			if(prevBrickRow != ballBrickRow) {
						el.Yspeed *= -1;	
					bothTestsFailed = false;
					
			}
			console.log("prevBrickRow: " + prevBrickRow + " ballBrickRow: " + ballBrickRow + " Ypos: " + el.Ypos + " brickMove: " + this.brickMove + " Yspeed: " + el.Yspeed)

			if(bothTestsFailed) { // armpit case, prevents ball from going through
				el.Xspeed *= -1;
				el.Yspeed *= -1;
				console.log("bothtestsFailed")
			}
					}
						}// check if the ball where under brick one frame ago
						this.brickHitBall = true
						}else{
						this.brickHitBall = false
					}						
				}else{
						this.brickHitBall = false
					}	
			});				
		},

		ballPaddleHandling(){
			let paddleTopEdgeY = this.canvas.height-this.PADDLE_DIST_FROM_EDGE;
			let paddleBottomEdgeY = paddleTopEdgeY + this.PADDLE_THICKNESS;
			let paddleLeftEdgeX = this.paddleX;
			let paddleRightEdgeX = paddleLeftEdgeX + this.PADDLE_WIDTH;

			this.balls.forEach(ball => {
				if( ball.Ypos > paddleTopEdgeY - ball.radius && // below the top of paddle
					ball.Ypos < paddleBottomEdgeY && // above bottom of paddle
					ball.Xpos > paddleLeftEdgeX && // right of the left side of paddle
					ball.Xpos < paddleRightEdgeX ) { // left of the left side of paddle
					
					ball.Yspeed *= -1;
					let centerOfPaddleX = this.paddleX+this.PADDLE_WIDTH/2;
					let ballDistFromPaddleCenterX = ball.Xpos - centerOfPaddleX;
					ball.Xspeed = ballDistFromPaddleCenterX * 0.08;
					this.paddleMenuShuffle = !this.paddleMenuShuffle
					}				
			});
		},
		moveAll(){
			this.ballMove()
			if(this.gameActive){
			this.ballBrickHandling()				
			}
			this.ballPaddleHandling()				
		},
		rowColToArrayIndex(col, row) {
			return col + this.BRICK_COLS * row;
		},
		drawBricks(){
			for(var eachRow=0;eachRow<this.BRICK_ROWS;eachRow++) {
				for(var eachCol=0;eachCol<this.BRICK_COLS;eachCol++) {

					var arrayIndex = this.rowColToArrayIndex(eachCol, eachRow); 

					if(this.brickGrid[arrayIndex].exists) {
						this.canvasContext.fillStyle = `rgb(${this.brickGrid[arrayIndex].red}, ${this.brickGrid[arrayIndex].green}, ${this.brickGrid[arrayIndex].blue}, ${this.brickGrid[arrayIndex].fade})`;
						this.canvasContext.fillRect(this.BRICK_W*eachCol,this.BRICK_H*eachRow + this.brickMove,
						this.BRICK_W-this.BRICK_GAP,this.BRICK_H-this.BRICK_GAP);
					} // end of is this brick here
				} // end of for each brick
			} // end of for each row
				this.brickMove = this.brickMove + this.brickMoveSpeed
			if(this.brickMove >= (this.BRICK_H)){
				this.addBricks();
			}
		},
		drawAll(){
			if(this.keyLeft){
				this.paddleX -= 5
			}
			if(this.keyRight){
				this.paddleX += 5
			}
			this.canvasContext.fillStyle = 'black';

			this.canvasContext.fillRect(0,0,this.canvas.width, this.canvas.height);
			this.balls.forEach(ball => {
					this.colorCircle(ball.Xpos,ball.Ypos,ball.radius,ball.color);
			});

			this.canvasContext.fillStyle = 'white';
			
			this.canvasContext.fillRect(this.paddleX, this.canvas.height-this.PADDLE_DIST_FROM_EDGE,
				this.PADDLE_WIDTH, this.PADDLE_THICKNESS);

			this.colorText(this.mouseX+","+this.mouseY, this.mouseX, this.mouseY, 'yellow')
			if(this.gameActive){
				this.drawBricks();	
			}
		},
		colorText(showWords, textX, textY, fillColor){
			this.canvasContext.fillStyle = fillColor;
			this.canvasContext.fillText(showWords, textX, textY)
		},
		colorCircle(centerX,centerY, radius, fillColor) {
			this.canvasContext.fillStyle = fillColor;
			this.canvasContext.beginPath();
			this.canvasContext.arc(centerX,centerY, radius, 0,Math.PI*2, true);
			this.canvasContext.fill();
		},	
		keyPress(e){
			console.log(e.keyCode)
				if(e.keyCode == 37){
					this.keyLeft = true
					this.keyDirection = -1
				}
				if(e.keyCode == 39){
					this.keyRight = true
					this.keyDirection = 1
					console.log(this.brickGrid)
				}
				if(e.keyCode == 27){
					console.log("esc")
					this.setGameActive(false)
				}
				if(e.keyCode == 32){
					this.balls[0].Yspeed *= -1;
					console.log("space")
				}
				if(e.keyCode == 66){
					console.log("b")
					this.brickReset();
					this.brickMove = 0;
					this.BRICK_ROWS = 7
					this.brickGrid.length = this.BRICK_COLS * 7
					console.log(this.BRICK_ROWS)
				}
				this.blast(e)
				console.log(this.keyLeft + ", " + this.keyRight)		

		},
		keyUp(e){
			if(e.keyCode == 37){
				this.keyLeft = false
			}
			if(e.keyCode == 39){
				this.keyRight = false
			}	
			console.log(this.keyLeft + ", " + this.keyRight)		
		},
		blast(e){
		this.blasts.forEach(el => {
			if(!this.dialog){
				if(e.keyCode == el.keyCode){
					if(el.timer < 0){
					this.balls[0].color = el.ballColor
					el.active = true
					el.backgroundFade = 0.5
					//speedball
						if(el.speedBall){
							this.balls[0].Yspeed = this.balls[0].Yspeed*3
							this.balls[0].Xspeed = this.balls[0].Xspeed*3
							el.timer = 100;
								setTimeout(() => {
									this.balls[0].Yspeed = this.balls[0].Yspeed/3
									this.balls[0].Xspeed = this.balls[0].Xspeed/3
								}, 250);
						}
						//ghostball
						if(el.goldBall){
							if(this.ghostBall){
							this.ghostBall = !this.ghostBall
							el.timer = 100
							el.class = ""							
							}else{
							this.ghostBall = !this.ghostBall
							el.class = "blink_me"
								setTimeout(() => {
									if(this.ghostBall){
										this.ghostBall = !this.ghostBall
										el.timer = 100
										el.class = ""										
									}
								}, 3000);								
							}
						}
						//extraBall
						if(el.extraBall){
							el.counter--;
							this.ballStorage.forEach(el => {
								if(el.id == this.newBallCount){
									el.Xpos = this.paddleX + this.PADDLE_WIDTH/2
									el.Ypos = this.canvas.height-this.PADDLE_DIST_FROM_EDGE-10
									el.Xspeed = 0;
									el.Yspeed =  -(window.innerHeight/250)
									this.balls.push(el)
								}
							});
							if(this.newBallCount >= 3){
								el.timer = 100;
								this.newBallCount = 1
							}else{
								this.newBallCount++;
							}
						}
						if(el.starBall){
							this.balls[0].Yspeed = this.balls[0].Yspeed*3
							this.balls[0].Xspeed = this.balls[0].Xspeed*3
							el.ballColor = 'yellow'
							this.damage *= 5;							
						}
					}
				}
			}
		});
		},
		blastTimer(){
			this.blasts.forEach(el => {
				//let prevTime = el.timer + el.timerSpeed
				if(el.timer >= 0){
					el.timer = el.timer - el.timerSpeed 
				}else{
					if(el.extraBall && el.counter == 0){
						el.counter = 3
					}
				el.backgroundFade = 1
			}
			});
		},
		removeBricks(){
			this.brickGrid.length = this.BRICK_COLS * 13
		},
		addBricks(){
		class Brick{ 
			constructor(red, green, blue, fade, exists) {
			this.red = red
			this.green = green
			this.blue = blue
			this.fade = fade
			this.exists = exists
		}
	}
	for(this.brickAdd = 0; this.brickAdd < 10; this.brickAdd++){
			let red = 0;
			let green = 255;
			let blue = 0;
			let fade = 1;
			let random = Math.random()
			if(random > 0.8 && random < 1 ){
				let random = Math.random()
				if(random > 0.75 && random < 1 ){
					red = 20;
					green = 23;
					blue = 168;
					console.log("blue")
				}
				if(random > 0.5 && random < 0.75){
					red = 19;
					green = 156;
					blue = 26;
				}
				if(random > 0.25 && random < 0.5){
					red = 147;
					green = 163;
					blue = 148;
				}
				if(random > 0 && random < 0.25){
					red = 255;
					green = 0;
					blue = 0;
				}
				let exists = true
				this.brickGrid.splice(30, 0, new Brick(red, green, blue, fade, exists));
			}else{
				let exists = false
				this.brickGrid.splice(30, 0, new Brick(red, green, blue, fade, exists));
			}
	}
	//this.brickGrid.splice((this.BRICK_ROWS)*this.BRICK_COLS, this.BRICK_COLS)
	this.BRICK_ROWS = this.BRICK_ROWS + 1
	this.brickMove = this.brickMove - this.BRICK_H 
		},
	},
	computed: mapGetters(['gameActive'])
	}
</script>
<style scoped>
canvas{
	position: fixed;
	z-index: +1;
	/*cursor: none;*/
	width: 100%
}
.container{
	position: absolute;
}
.blink{
	background-color: rgb(0, 0, 0);
	font-size: 25px;
	color: white;
	animation: blink 1.5s linear infinite;
}
@keyframes blink{
0%{opacity: 0;}
50%{opacity: .5;}
100%{opacity: 1;}
}
.blink_me {
  animation: blinker 1s linear infinite;
}
@keyframes blinker {
  50% {
    opacity: 0.5;
  }
}
.level{
	opacity: 0.08;
}
.v-progress-linear{
	z-index: +2;
	background-color: rgb(32, 32, 32) !important;
}
.scoreboard{
	position: absolute;
	width: 100%;
}
.title{
	opacity: 0.6;
}
.blasttext{
	width: 100%
}
.relative{
	position: relative;
}
.absolute{
	position: absolute;
}
</style>