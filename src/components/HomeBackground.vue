
<template>
    <canvas id="gameCanvas" >
    </canvas>
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
    mounted(){

    this.canvas = document.getElementById('gameCanvas');
    this.canvasContext = this.canvas.getContext('2d');
    
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    var framesPerSecond = 100;
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
}

    }
  }
</script>
<style>
canvas{
    position: fixed;
    z-index: +1;
}
</style>
