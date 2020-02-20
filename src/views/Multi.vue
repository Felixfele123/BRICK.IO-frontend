
<template>
    <canvas id="gameCanvas" width="800" height="600" >
    </canvas>
</template>

<script>
    export default {
    name: 'HomeBackground',
    data: () => ({
        ballX: 300,
        ballY: 100,
        ballSpeedX: 2,
		ballSpeedY: 3,
		
		BRICK_W: 80,
		BRICK_H: 20,
		BRICK_ROWS: 10,
		BRICK_COLS: 14,
		BRICK_GAP: 2,
		brickGrid: new Array(140),
		bricksLeft: 0,

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
    

	this.canvas.addEventListener('mousemove', this.updateMousePos);

    let framesPerSecond = 100;
	setInterval(this.updateAll, 1000/framesPerSecond);

    },
    methods: {

	updateMousePos(evt) {
	let rect = this.canvas.getBoundingClientRect();
	let root = document.documentElement;

	this.mouseX = evt.clientX - rect.left - root.scrollLeft;
	this.mouseY = evt.clientY - rect.top - root.scrollTop;

	this.paddleX = this.mouseX - this.PADDLE_WIDTH/2;

},

	drawAll() {
	this.colorRect(0,0, this.canvas.width,this.canvas.height, 'black'); // clear screen

	this.colorCircle(this.ballX,this.ballY, this.radius, 'white'); // draw ball

	this.colorRect(this.paddleX, this.canvas.height-this.PADDLE_DIST_FROM_EDGE,
				this.PADDLE_WIDTH, this.PADDLE_THICKNESS, 'white');
	
	this.drawBricks();
					
	

},
	colorRect(topLeftX,topLeftY, boxWidth,boxHeight, fillColor) {
	this.canvasContext.fillStyle = fillColor;
	this.canvasContext.fillRect(topLeftX,topLeftY, boxWidth,boxHeight);
},

	colorCircle(centerX,centerY, radius, fillColor) {
	this.canvasContext.fillStyle = fillColor;
	this.canvasContext.beginPath();
	this.canvasContext.arc(centerX,centerY, radius, 0,Math.PI*2, true);
	this.canvasContext.fill();
},

    colorText(showWords, textX, textY, fillColor){

    this.canvasContext.fillStyle = fillColor;
    this.canvasContext.fillText(showWords, textX, textY);

}
	}
}
</script>
<style>
canvas{
    position: absolute;
    z-index: +1;
}
</style>