
<template>
	<v-container class="justify-center pa-0"  fluid fill-height>
		<v-card @click="setGameActive(true)" v-if="!gameActive" class="transparent justify-center align-center text-center">
			<v-card-title class="white--text display-4 level">Level 1</v-card-title>
			<span class="blink">Click to play</span>

		</v-card>
		<canvas id="gameCanvas">
		</canvas>
		<v-layout class="align-end" v-if="gameActive" >

			<v-progress-linear v-for="blast in blasts" :class="`${blast.class} mx-2`" :key="blast.index" v-model="blast.timer" :background-color="`rgb(255, 165, 0,${blast.backgroundFade})`" :color="`rgb(255, 165, 0, ${blast.fade})`" height="40" reactive>
				<strong>{{blast.text}}</strong>
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
		radius: window.innerHeight/100,

		ballX: window.innerWidth/2,
		ballY: window.innerHeight/3,
		ballSpeedX: window.innerWidth/600,
		ballSpeedY: window.innerHeight/500,

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

//blast
		
		blasts: [
			{fade:0.01, backgroundFade: 0.5, text: "Q", class: "", timer: 100, timerSpeed: 6, active: false, ballColor: "yellow", keyCode: 81, speedBall: true},
			{fade:0.01, backgroundFade: 0.5, text: "W", class: "", timer: 100, timerSpeed: 0.5, active: false, ballColor: "red", keyCode: 87, goldball: true},
			{fade:0.01, backgroundFade: 0.5, text: "E", class: "", timer: 100, timerSpeed: 0.1, active: false, ballColor: "yellow", keyCode: 69},
			{fade:0.01, backgroundFade: 0.5, text: "R", class: "", timer: 100, timerSpeed: 0.05, active: false, ballColor: "yellow", keyCode: 82},
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
		ballReset(){
			this.ballX = this.canvas.width/2
			this.ballY = this.canvas.height/2
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
			}else{
				console.log('wehewww')
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
			this.ballX += this.ballSpeedX;
			this.ballY += this.ballSpeedY;

			if(this.ballX > this.canvas.width - this.radius){
				this.ballSpeedX *= -1;
			}
			if(this.ballX < this.radius){
				this.ballSpeedX *= -1;
			}
			if(this.ballY > this.canvas.height - this.radius){
				this.ballReset()
			}
			if(this.ballY < this.radius){
				this.ballSpeedY *= -1
			}
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
			var ballBrickCol = Math.floor(this.ballX / this.BRICK_W);
			var ballBrickRow = Math.floor(this.ballY / this.BRICK_H);
			var brickIndexUnderBall = this.rowColToArrayIndex(ballBrickCol, ballBrickRow);
			if(ballBrickCol >= 0 && ballBrickCol < this.BRICK_COLS &&
				ballBrickRow >= 0 && ballBrickRow < this.BRICK_ROWS) {

				if(this.brickGrid[brickIndexUnderBall].exists) {

					if(this.brickGrid[brickIndexUnderBall].fade > 0.5){
						if(this.goldball){
							this.brickGrid[brickIndexUnderBall].exists = false
						}else{
							this.brickGrid[brickIndexUnderBall].fade -= 0.1;
						}
					}else{
						this.brickGrid[brickIndexUnderBall].exists = false
					}
					
					let prevBallX = this.ballX - this.ballSpeedX;
					let prevBallY = this.ballY - this.ballSpeedY;
					let prevBrickCol = Math.floor(prevBallX / this.BRICK_W)
					let prevBrickRow = Math.floor(prevBallY / this.BRICK_H)

					var bothTestsFailed = true;

			if(prevBrickCol != ballBrickCol) {
				if(this.isBrickAtColRow(prevBrickCol, ballBrickRow) == false) {
					this.ballSpeedX *= -1;
					bothTestsFailed = false;
				}
			}
			if(prevBrickRow != ballBrickRow) {
				if(this.isBrickAtColRow(ballBrickCol, prevBrickRow) == false) {
					this.ballSpeedY *= -1;
					bothTestsFailed = false;
				}
			}

			if(bothTestsFailed) { // armpit case, prevents ball from going through
				this.ballSpeedX *= -1;
				this.ballSpeedY *= -1;
			}

			this.goldball = false
			this.ballColor = 'white'
					
				}
			}
		},

		ballPaddleHandling(){
						let paddleTopEdgeY = this.canvas.height-this.PADDLE_DIST_FROM_EDGE;
			let paddleBottomEdgeY = paddleTopEdgeY + this.PADDLE_THICKNESS;
			let paddleLeftEdgeX = this.paddleX;
			let paddleRightEdgeX = paddleLeftEdgeX + this.PADDLE_WIDTH;
			if( this.ballY > paddleTopEdgeY - this.radius && // below the top of paddle
				this.ballY < paddleBottomEdgeY && // above bottom of paddle
				this.ballX > paddleLeftEdgeX && // right of the left side of paddle
				this.ballX < paddleRightEdgeX ) { // left of the left side of paddle
				
				this.ballSpeedY *= -1;
				let centerOfPaddleX = this.paddleX+this.PADDLE_WIDTH/2;
				let ballDistFromPaddleCenterX = this.ballX - centerOfPaddleX;
				this.ballSpeedX = ballDistFromPaddleCenterX * 0.08;
				}
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

			this.colorCircle(this.ballX,this.ballY, this.radius, this.ballColor);

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
					if(el.timer <= 0){
					this.ballColor = el.ballColor
					el.active = true
					el.backgroundFade = 0.5
						if(el.speedBall){
							this.ballSpeedY = this.ballSpeedY*3
							this.ballSpeedX = this.ballSpeedX*3
								setTimeout(() => {
									this.ballSpeedY = this.ballSpeedY/3
									this.ballSpeedX = this.ballSpeedX/3
									el.timer = 100;
								}, 1000);
						}
						if(el.goldball){
							this.goldball = true
							setTimeout(() => {
								el.timer = 100;
							}, 500);
						}
					

					}
				}
			});
			
		},
		blastTimer(){
			this.blasts.forEach(el => {
				if(el.timer >= 0){
					el.timer = el.timer - el.timerSpeed 
				}else{
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
.q_timer{
	background-image: url('/flameBlast.png') !important;
}
@keyframes blink{
0%{opacity: 0;}
50%{opacity: .5;}
100%{opacity: 1;}
}
.level{
	opacity: 0.08;
}
.v-progress-linear{
	z-index: +2;
	background-color: rgb(32, 32, 32) !important;
}
.active
{
		
}

</style>