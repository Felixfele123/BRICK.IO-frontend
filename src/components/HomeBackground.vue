
<template>
  <v-container class="justify-center pa-0"  fluid fill-height>
      <v-card @click="play()" class="transparent justify-center align-center text-center">
            <v-card-title class="white--text display-4 level">Level 1</v-card-title>
        <span class="blink">Click to play</span>

      </v-card>
    <canvas id="homeCanvas"  @resize="resize">
    </canvas>
	</v-container>

</template>

<script>
    export default {
    name: 'HomeBackground',
    data: () => ({
        ballX: Math.random() * 100,
        ballY: Math.random() * 100,
        ballSpeedX: 2,
        ballSpeedY: 3,

        PADDLE_WIDTH: 100,
        PADDLE_THICKNESS: 12,
        PADDLE_DIST_FROM_EDGE: 60,
		paddleX: 400,
		paddleHit: true,

        canvas: null, 
        canvasContext: null
	}),
	created() {
	window.addEventListener("resize", this.resize);
	},

    mounted(){

    this.canvas = document.getElementById('homeCanvas');
    this.canvasContext = this.canvas.getContext('2d');
    
    this.canvas.width = window.innerWidth;
	this.canvas.height = window.innerHeight;
	

    let framesPerSecond = 100;
	setInterval(this.updateAll, 1000/framesPerSecond);

    },
    methods: {


updateMousePos() {

	// let mouseY = evt.clientY - rect.top - root.scrollTop;

	if(this.paddleHit){
		this.paddleX = this.ballX - this.PADDLE_WIDTH/1.6;
	}else{
		this.paddleX = this.ballX - this.PADDLE_WIDTH/1.5;
	}
},

resize() {
    this.canvas.width = window.innerWidth;
	this.canvas.height = window.innerHeight;

},

updateAll() {
	this.moveAll();
    this.drawAll();
    this.updateMousePos();
},
moveAll() {
	this.ballX += this.ballSpeedX;
	this.ballY += this.ballSpeedY;

	if(this.ballX < 0) { //left
		this.ballSpeedX *= -1;
	}
	if(this.ballX > this.canvas.width) { // right
		this.ballSpeedX *= -1;
	}
	if(this.ballY < 0) { // top
		this.ballSpeedY *= -1;
	}

	let ballBrickCol = Math.floor(this.ballX / this.BRICK_W);
	let ballBrickRow = Math.floor(this.ballY / this.BRICK_H);
	let brickIndexUnderBall = this.rowColToArrayIndex(ballBrickCol, ballBrickRow);
	if(ballBrickCol >= 0 && ballBrickCol < this.BRICK_COLS &&
		ballBrickRow >= 0 && ballBrickRow < this.BRICK_ROWS) {

		if(this.brickGrid[brickIndexUnderBall].exists) {
			this.brickGrid[brickIndexUnderBall].exists = false;
			this.ballSpeedY *= -1;
		}
	}
	

	let paddleTopEdgeY = this.canvas.height-this.PADDLE_DIST_FROM_EDGE;
	let paddleBottomEdgeY = paddleTopEdgeY + this.PADDLE_THICKNESS;
	let paddleLeftEdgeX = this.paddleX;
	let paddleRightEdgeX = paddleLeftEdgeX + this.PADDLE_WIDTH;
	if( this.ballY > paddleTopEdgeY && // below the top of paddle
		this.ballY < paddleBottomEdgeY && // above bottom of paddle
		this.ballX > paddleLeftEdgeX && // right of the left side of paddle
		this.ballX < paddleRightEdgeX) { // left of the left side of paddle
		
		this.ballSpeedY *= -1;
		this.paddleHit = !this.paddleHit;
		let centerOfPaddleX = this.paddleX+this.PADDLE_WIDTH/2;
		let ballDistFromPaddleCenterX = this.ballX - centerOfPaddleX;
		this.ballSpeedX = ballDistFromPaddleCenterX * 0.35;
	}


},

rowColToArrayIndex(col, row) {
	return col + this.BRICK_COLS * row;
},

drawAll() {
	this.colorRect(0,0, this.canvas.width,this.canvas.height, 'black'); // clear screen

	this.colorCircle(this.ballX,this.ballY, 10, 'white'); // draw ball

	this.colorRect(this.paddleX, this.canvas.height-this.PADDLE_DIST_FROM_EDGE,
				this.PADDLE_WIDTH, this.PADDLE_THICKNESS, 'white');
},

colorRect(topLeftX,topLeftY, boxWidth,boxHeight, fillColor) {
	this.canvasContext.fillStyle = fillColor;
	this.canvasContext.fillRect(topLeftX,topLeftY, boxWidth,boxHeight);
},

colorCircle(centerX,centerY, radius, fillColor) {
	this.canvasContext.fillStyle = fillColor;
	this.canvasContext.beginPath();
	this.canvasContext.arc(centerX,centerY, 10, 0,Math.PI*2, true);
	this.canvasContext.fill();
},
play(){
	
	this.$router.push({ path: '/multi' })
},

	},


	

  }
</script>
<style>
#homeCanvas{
	width: 100%;
    position: fixed;
    z-index: +1;
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
.level{
	opacity: 0.08;
}
</style>
