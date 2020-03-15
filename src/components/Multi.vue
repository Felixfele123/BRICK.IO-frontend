
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
				<v-card-title class="title">score: {{brickHit}}</v-card-title>
			</v-card>
		</div>
		<v-layout class="align-end " v-if="gameActive" fluid>

			<v-progress-linear v-for="blast in blasts" :class="`${blast.class} mx-2 relative blink_me`" :key="blast.index" v-model="blast.timer" :background-color="`rgb(255, 165, 0,${blast.backgroundFade})`" :color="`rgb(255, 165, 0, ${blast.fade})`" height="40" reactive>
				<div class="blasttext ml-6"><strong>{{blast.text}}</strong></div>
				<div class="blastimage text-center justify-center absolute">
					<v-img :src="blast.image" alt="image" srcset="" height="40" width="70"></v-img>
				</div>
				<div v-if="blast.extraBall" class="blasttext  ml-6"><strong>{{blast.counter}}/3</strong></div>
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
		PaddleX: window.innerWidth/2,
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
		brickHit: 0,
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
		ballSpeedY: window.innerHeight/250,
		newBallCount: 1,
		ghostBall: false,
		ballStorage: [
			{id: 0, Xpos: window.innerWidth/2, Ypos: window.innerHeight/3, Xspeed: window.innerWidth/300, Yspeed: window.innerHeight/250, radius: window.innerHeight/100, color: "white", reflect: true, active: true},
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
			{fade:0.01, backgroundFade: 0.5, text: "R", class: "", timer: 100, timerSpeed: 0.05, active: false, ballColor: "yellow", keyCode: 82, image: "/starBall.png"},
		]

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
	
	window.addEventListener('keyup', this.blastGoldball);

	this.ballStorage.forEach(el => {
		if(el.active){
			this.balls.push(el)
		}
	});
	
	class Brick{ 
		constructor(color, fade, exists) {
		this.color = color
		this.fade = fade
		this.exists = exists
		}
	}
	
	
	for(this.i=0; this.i< 3*this.BRICK_COLS; this.i++){

    let color = 255;
	let fade = 1;
	let exists = false

    this.brickGrid.push(new Brick(color,fade,exists));
}
	for(; this.i<this.BRICK_COLS * this.BRICK_ROWS; this.i++){

    let color = 255;
	let fade = 1;
	let exists = true

    this.brickGrid.push(new Brick(color,fade,exists));
}

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

			console.log(this.brickGrid)
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
		updateAll(){
			this.moveAll()
			this.drawAll()
			if(!this.gameActive){
				this.updateMousePosMenu()
			}
		},

		updateMousePos(evt){
			if(this.gameActive){
			let rect = this.canvas.getBoundingClientRect();
			let root = document.documentElement;

			this.mouseX = evt.clientX - rect.left - root.scrollLeft
			this.mouseY = evt.clientY - rect.top - root.scrollTop
			this.paddleX = this.mouseX - this.PADDLE_WIDTH/2	
			}
	
		},
		updateMousePosMenu(){
				if(this.paddleHit){
					this.paddleX = this.ballX - this.PADDLE_WIDTH/1.6;
				}else{
					this.paddleX = this.ballX - this.PADDLE_WIDTH/1.5;
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
			var ballBrickRow = Math.floor(el.Ypos / this.BRICK_H);
			var brickIndexUnderBall = this.rowColToArrayIndex(ballBrickCol, ballBrickRow);		
			if(ballBrickCol >= 0 && ballBrickCol < this.BRICK_COLS &&
			ballBrickRow >= 0 && ballBrickRow < this.BRICK_ROWS) {
				if(this.brickGrid[brickIndexUnderBall].exists) {
					if(el.id > 0){
						this.brickGrid[brickIndexUnderBall].exists = false
						this.ballReset(el);
					}else if(this.ghostBall){
						this.brickGrid[brickIndexUnderBall].fade -= 0.1;
					}else{
					if(this.brickGrid[brickIndexUnderBall].fade > 0.5){
						if(this.goldball){
							this.brickGrid[brickIndexUnderBall].exists = false
							this.brickHit += 5;
						}else{
							this.brickGrid[brickIndexUnderBall].fade -= 0.1;
							this.brickHit++;
						}
					}else{
						this.brickGrid[brickIndexUnderBall].exists = false
					}
					let prevBallX = el.Xpos - el.Xspeed;
					let prevBallY = el.Ypos - el.Yspeed;
					let prevBrickCol = Math.floor(prevBallX / this.BRICK_W)
					let prevBrickRow = Math.floor(prevBallY / this.BRICK_H)

					var bothTestsFailed = true;
			if(prevBrickCol != ballBrickCol) {
				if(this.isBrickAtColRow(prevBrickCol, ballBrickRow) == false) {
					el.Xspeed *= -1;
					bothTestsFailed = false;
				}
			}
			if(prevBrickRow != ballBrickRow) {
				if(this.isBrickAtColRow(ballBrickCol, prevBrickRow) == false) {
						el.Yspeed *= -1;	
					bothTestsFailed = false;
				}
			}
			if(bothTestsFailed) { // armpit case, prevents ball from going through
				el.Xspeed *= -1;
				el.Yspeed *= -1;
			}

			this.goldball = false
			el.color = 'white'
					
				}
			}						
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
					}				
			});

		},

		moveAll(){
			
			this.ballMove()

			this.ballBrickHandling()

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
						this.canvasContext.fillStyle = `rgb(${this.brickGrid[arrayIndex].color}, 0, 0, ${this.brickGrid[arrayIndex].fade})`;
						this.canvasContext.fillRect(this.BRICK_W*eachCol,this.BRICK_H*eachRow,
						this.BRICK_W-this.BRICK_GAP,this.BRICK_H-this.BRICK_GAP);
					} // end of is this brick here
				} // end of for each brick
			} // end of for each row
		},
		
		drawAll(){
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
				this.drawBricks()	
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
		blastGoldball(e){
			
			this.blasts.forEach(el => {
				if(e.keyCode == el.keyCode){
					if(el.timer < 0){
					this.balls[0].color = el.ballColor
					el.active = true
					el.backgroundFade = 0.5
						if(el.speedBall){
							this.balls[0].Yspeed = this.balls[0].Yspeed*3
							this.balls[0].Xspeed = this.balls[0].Xspeed*3
							el.timer = 100;
								setTimeout(() => {
									this.balls[0].Yspeed = this.balls[0].Yspeed/3
									this.balls[0].Xspeed = this.balls[0].Xspeed/3
								}, 250);
						}
						if(el.goldBall){
							this.ghostBall = !this.ghostBall
						}
						
						if(el.extraBall){
							el.counter--;
							this.ballStorage.forEach(el => {
								if(el.id == this.newBallCount){
									el.Xpos = this.paddleX + this.PADDLE_WIDTH/2
									el.Ypos = this.canvas.height-this.PADDLE_DIST_FROM_EDGE-10
									el.Xspeed = 0;
									el.Yspeed =  -(window.innerHeight/250)
									this.balls.push(el)
									console.log(this.newBallCount)
								}
							});
							if(this.newBallCount >= 3){
								el.timer = 100;
								this.newBallCount = 1
							}else{
								this.newBallCount++;
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
		play(){
			this.gameActive = true;
	
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