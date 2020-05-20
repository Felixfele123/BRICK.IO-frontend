
<template>
	<v-container class="justify-center pa-0"  fluid fill-height>
		<v-card @click.prevent="joinGameLobby" v-if="!gameActive && !gameRequest" class="transparent justify-center align-center text-center">
			<v-card-title class="white--text display-4 level">Level 1</v-card-title>
			<span class="blink">Click to play</span>
		</v-card>
		<canvas id="gameCanvas">
		</canvas>
		<div class="white--text justify-left scoreboard" v-if="gameActive">
			<v-card class="transparent white--text text--center" width="12%">
				<v-card-title class="title">SCORE</v-card-title>
				<v-card-text class="white--text pb-0">
				<p style="text-align:left; "> white <span style="float:right;">{{balls[0].score}} </span> </p>
				</v-card-text>
				<v-card-text class="red--text pb-0">
				<p style="text-align:left; "> red <span style="float:right;">{{balls[1].score}} </span> </p>
				</v-card-text>
				<v-card-text class="blue--text pb-0">
				<p style="text-align:left; "> blue <span style="float:right;">{{balls[2].score}} </span> </p>
				</v-card-text>
				<v-card-text class="green--text pb-0">
				<p style="text-align:left; "> green <span style="float:right;">{{balls[3].score}} </span> </p>
				</v-card-text>


			</v-card>
		</div>
		<v-layout column justify-center align-center v-if="gameActive || gameRequest" class="relative">
			<div class="text-center justify-center">
				<v-dialog dark v-model="dialog" width="500">
				<v-card class="justify-center">
				<v-row class="ma-0 text-center justify-center">
					<v-card-title class="pb-0 primary-text">
						CLEARED!
					</v-card-title>
				</v-row>
				<v-row class="ma-0 text-center ">
					<v-col v-for="stat in stats" :key="stat.index" >
						<v-card-text class="pb-0">
							{{stat.stat}}
						</v-card-text>
						<v-card-text class="pt-1 title">
							{{stat.count}}
						</v-card-text>
					</v-col>
				</v-row>
				<v-row class="ma-0 text-center justify-center">
					<v-col class="pt-0 pl-12">
						<v-avatar tile class="justify-center text-center" size="80">
							<img class="" src="bronze-3.png" alt="" srcset="">
						</v-avatar> 
                      <v-card-text class="pa-0 text-center rome white--text">BRONZE III </v-card-text>
                      <v-card-text class="pa-0 text-center rome grey--text">DIV XI</v-card-text>						
					</v-col>	
					<v-col class="pt-0 pr-12 justify-center align-center ">
						<div class="align-center  text-center">
						<v-avatar class="pb-1 mx-2 my-3" :size="coinSize">
							<img src="coin.png" alt="" srcset="">
						</v-avatar>
							<span class="title">{{coinCount}}</span>							
						</div>
						<div class="align-center  text-center">
						<v-avatar class="pb-1 mx-2 my-3" :size="coinSize">
							<img src="coin.png" alt="" srcset="">
						</v-avatar>
							<span class="title">{{xp}}</span>							
						</div>
					</v-col>
				</v-row>
				<div class="py-3">
				<v-form class="mb-8 text-center ">
					<v-btn @click="continueToNextLevel()">Continue</v-btn>
				</v-form>	
				</div>
				</v-card>
				<v-card v-if="gameRequest" class="justify-center">
					<v-card-title disabled class="headline white--text justify-center align-center">searching for other players..</v-card-title>
					<v-row class="ma-0 text-center justify-center">
						<v-col :class="`playerSearch mx-2 ${player.class}`" v-for="player in players" :key="player.id">
						</v-col>
					</v-row>
                <v-layout class="justify-center py-4">
                  <v-form class="px-3 justify-center">
                    <v-btn color="white" class="black--text justify-center" @click="cancelRequest()">CANCEL</v-btn>
                  </v-form> 
                </v-layout>
				</v-card>
				</v-dialog>
			</div>
		</v-layout>
		<v-container v-if="gameActive" fluid fill-height class="align-end justify-center pa-0">
			<v-row height="40">
				<v-progress-linear rounded class="mx-3" :buffer-value="healthBuffer" v-model="health" :background-color="healthBackgroundColor" :color="`rgb(0, 165, 0, 1)`" height="8" reactive>
				</v-progress-linear>
					
				<v-col v-for="blast in blasts" :key="blast.index" class="pb-0 pt-1">
					<v-progress-linear  :class="`${blast.class} `"  v-model="blast.timer" :background-color="`rgb(255, 165, 0,${blast.backgroundFade})`" :color="`rgb(255, 165, 0, ${blast.fade})`" height="40" reactive>
						<div class="blasttext ml-6 hidden-xs-only"><strong>{{blast.text}}</strong></div>
						<div class="blastimage text-center justify-center absolute">
							<v-img :src="blast.image" alt="image" srcset="" height="40" width="70"></v-img>
						</div>
						<div v-if="blast.extraBall" class="blasttext hidden-xs-only ml-6"><strong>{{blast.counter}}/3</strong></div>
					</v-progress-linear>
				</v-col>
			</v-row>
		</v-container>
	</v-container>
</template>

<script>
	import {mapGetters, mapMutations, mapActions} from "vuex";
	import io from 'socket.io-client';
	import { throttle } from 'throttle-debounce';
    export default {
    name: 'Multi',
    data: () => ({
        canvas: null, 
		canvasContext: null,
		socket: io('localhost:3456'),


		PADDLE_WIDTH: window.innerWidth/15,
		PADDLE_DIST_FROM_EDGE: window.innerHeight/8,
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
		newBallCount: 4,
		ghostBall: false,
		ballStorage: [
			{id: 0, Xpos: window.innerWidth/2, Ypos: window.innerHeight/3, Xspeed: -window.innerWidth/300, Yspeed: -window.innerHeight/250, radius: window.innerHeight/200, color: "white", reflect: true, active: true, score: 0},
			{id: 1, Xpos: window.innerWidth/2, Ypos: window.innerHeight/3, Xspeed: -window.innerWidth/600, Yspeed: -window.innerHeight/500, radius: window.innerHeight/200, color: "red", reflect: true, active: true, score: 0},
			{id: 2, Xpos: window.innerWidth/2, Ypos: window.innerHeight/3, Xspeed: -window.innerWidth/1200, Yspeed: -window.innerHeight/1000, radius: window.innerHeight/200, color: "blue", reflect: true, active: true, score: 0},
			{id: 3, Xpos: window.innerWidth/2, Ypos: window.innerHeight/3, Xspeed: -window.innerWidth/2400, Yspeed: -window.innerHeight/2000, radius: window.innerHeight/200, color: "green", reflect: true, active: true, score: 0},
			{id: 4, Xpos: window.innerWidth/2, Ypos: window.innerHeight/3, Xspeed: 0, Yspeed: -(window.innerHeight/250), radius: window.innerHeight/200, color: "white", reflect: false, active: false, bullet: true},
			{id: 5, Xpos: window.innerWidth/2, Ypos: window.innerHeight/3, Xspeed: 0, Yspeed: -(window.innerHeight/250), radius: window.innerHeight/200, color: "white", reflect: false, active: false, bullet: true},
			{id: 6, Xpos: window.innerWidth/2, Ypos: window.innerHeight/3, Xspeed: 0, Yspeed: -(window.innerHeight/250), radius: window.innerHeight/200, color: "white", reflect: false, active: false, bullet: true},
			{id: 7, Xpos: window.innerWidth/2, Ypos: window.innerHeight/3, Xspeed: 0, Yspeed: -(window.innerHeight/250), radius: window.innerHeight/200, color: "white", reflect: true, active: false},
		],
		balls: [],
//blast
		blasts: [
			{fade:0.01, backgroundFade: 0.5, text: "Q", class: "", timer: 100, timerSpeed: 2, active: false, ballColor: "blue", keyCode: 81, speedBall: true, image: "/speedBall.png"},
			{fade:0.01, backgroundFade: 0.5, text: "W", class: "", timer: 100, timerSpeed: 5, active: false, ballColor: "yellow", keyCode: 87, extraBall: true, counter: 0, image: "/damageBall.png"},
			{fade:0.01, backgroundFade: 0.5, text: "E", class: "", timer: 100, timerSpeed: 0.5, active: false, ballColor: "red", keyCode: 69, goldBall: true, image: "/ghostBall.png"},
			{fade:0.01, backgroundFade: 0.5, text: "R", class: "", timer: 100, timerSpeed: 0.05, active: false, ballColor: "yellow", keyCode: 82, starBall: true, image: "/starBall.png"},
		],
		stats: [
			{stat: "HITS", value: 0, count: 0},
			{stat: "DESTROYED", value: 0, count: 0},
			{stat: "TIME", value: "", count:0 },
		],

		players: [
			{id: 0, paddleX: window.innerWidth/2, color: 'white', class: "", score: 0},
			{id: 1, paddleX: window.innerWidth/2, color: 'red', class: "", score: 0},
			{id: 2, paddleX: window.innerWidth/2, color: 'blue', class: "", score: 0},
			{id: 3, paddleX: window.innerWidth/2, color: 'green', class: "", score: 0}
			],
		
		brickMove: 0,
		brickHitBall: false,
		brickMoveSpeed: 0.05,
		gamePause: false,
		paddleMenuShuffle: false,
		damage: 0.1,
		brickDestoryedCount: 0,

		healthBackgroundColor: 'black',
		healthBuffer: 100,
		health: 100,
		brickAddCount: 0,
		dialog: false,

		keyLeft: false,
		keyRight: false,
		keyDirection: 1,

		xp: 0,
		gameRequest: false,
		scoreboard: false,

		//gameplay timer
		seconds: 0,
		tenSeconds: 0,
		minutes: 0,
		tenMinutes: 0,

		//game finish animation
		secondsCheck: 0,
		coinCount: 0,
		coinSize: 30,

		//calculate recived coins
		secondsCount: 0,
		brickHitCount: 0,
		coins: 0,

		userID: "",
		playerID: null,
		//vue bs, irrelevant
		brickAdd: 0,
	}),
	created() {
	window.addEventListener("resize", this.resize);
	},
    async mounted(){
    this.canvas = document.getElementById('gameCanvas');
	this.canvasContext = this.canvas.getContext('2d');
	
	await this.fetchUserdata();
	this.userID = this.allUserdata[0].username
	let framesPerSecond = 100;

	setInterval(this.updateAll, 1000/framesPerSecond)
	setInterval(this.blastTimer, 100)
	setInterval(this.timer, 1000)

    this.canvas.width = window.innerWidth;
	this.canvas.height = window.innerHeight;
	this.canvas.addEventListener('mousemove', this.updateMousePos);

	this.socket.on("SESSION_ID", data => {
		if(data > 2){
			setTimeout(() => {
				this.startGame()
			},1000)
		}
		if(this.gameRequest){
			this.playerID = data
		}
			this.players[data].class = ''
			if(this.players[data+1]){
			this.players[data+1].class = 'blink_me'	
			}
			if(this.players[data+2]){
			this.players[data+2].class = 'blink_me'	
			}
			if(this.players[data+3]){
			this.players[data+3].class = 'blink_me'	
			}
	console.log('g')
	});
	this.socket.on("MOUSEPOS", data => {
		this.players[data.playerID].paddleX = data.brickPosIndex*this.canvas.width - this.PADDLE_WIDTH/2
	});
	this.socket.on("GAME_UPDATE", data => {
		this.processGameUpdate(data)
		this.initState()
	});
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
		...mapMutations(["setGameActive", "setRefreshData"]),
		...mapActions(["insertData", "fetchUserdata", "processGameUpdate", "initState"]),
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
		timer(){
			if(this.gameActive && !this.dialog){
			this.secondsCount += 1	
			}
		},
		startGame(){
			this.gameRequest = false
			this.dialog = false	
			this.setGameActive(true)
		},
		joinGameLobby(e){
			this.setGameActive(true)
			//this.dialog = true;
			//this.gameRequest = true
			e.preventDefault();
			this.socket.emit('SEND_GAMEREQUEST', {
				userID: this.userID
			});
		},
		ballReset(ball){
			if(ball.id <= 3){
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
			this.updateMousePosMenu()
			this.gameFinished()

			/*this.brickGrid.forEach(el => {
				if(this.brickMove > 10000 && el.exists){
					this.setGameActive(false)
				}
				
			});*/
		},
		handleInput(dir){
			throttle(20, 
				this.socket.emit('SEND_MOUSEPOS', dir));
		},
		sendMousePos(e){
			e.preventDefault();
			let brickPosIndex = this.mouseX/this.canvas.width;
			this.handleInput(brickPosIndex)
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
			
			//this.players[this.playerID].paddleX = this.mouseX - this.PADDLE_WIDTH/2				
			//this.sendMousePos(evt)
			this.players[0].paddleX = this.mouseX - this.PADDLE_WIDTH/2
			}
		},
		updateMousePosMenu(){
			this.players.forEach(player => {
				if(player.id > 0){
					if(this.paddleMenuShuffle){
						player.paddleX = this.balls[player.id].Xpos - this.PADDLE_WIDTH/1.3;
					}else{
						player.paddleX = this.balls[player.id].Xpos - this.PADDLE_WIDTH/1.2;
					}	
				}
								
			});
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
			this.calculateCoins();
			if(el.score >= 50){
				this.dialog = true;
			}
			//Game finished successfully

				if(this.brickGrid[brickIndexUnderBall].exists) {

					if(!this.brickHitBall || col !== prevCol){
					if(el.bullet){
						this.brickGrid[brickIndexUnderBall].exists = false
						this.stats[1].value += 1;
						this.stats[0].value += 1;
						this.balls[el.id].score++;
						this.ballReset(el);
					}else if(this.ghostBall){
						this.brickGrid[brickIndexUnderBall].fade -= this.damage;
					}else{
					if(this.brickGrid[brickIndexUnderBall].fade > 0.5){
						if(this.goldball){
							this.brickGrid[brickIndexUnderBall].exists = false
							this.stats[1].value += 1;
							this.stats[0].value  += 1;
							this.balls[el.id].score++;

						}else{
							this.brickGrid[brickIndexUnderBall].fade -= this.damage;
							this.stats[0].value ++;
							this.balls[el.id].score++;
						}
					}else{
						this.brickGrid[brickIndexUnderBall].exists = false
						this.stats[1].value += 1;
						this.balls[el.id].score++;
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
			this.players.forEach(el => {
			let paddleTopEdgeY = this.canvas.height-this.PADDLE_DIST_FROM_EDGE;
			let paddleBottomEdgeY = paddleTopEdgeY + this.PADDLE_THICKNESS;
			let paddleLeftEdgeX = el.paddleX;
			let paddleRightEdgeX = paddleLeftEdgeX + this.PADDLE_WIDTH;

			this.balls.forEach(ball => {
				if( ball.Ypos > paddleTopEdgeY - ball.radius && // below the top of paddle
					ball.Ypos < paddleBottomEdgeY && // above bottom of paddle
					ball.Xpos > paddleLeftEdgeX && // right of the left side of paddle
					ball.Xpos < paddleRightEdgeX &&
					ball.id == el.id) { // left of the left side of paddle
					
					ball.Yspeed *= -1;
					let centerOfPaddleX = el.paddleX+this.PADDLE_WIDTH/2;
					let ballDistFromPaddleCenterX = ball.Xpos - centerOfPaddleX;
					ball.Xspeed = ballDistFromPaddleCenterX * 0.08;
					this.paddleMenuShuffle = !this.paddleMenuShuffle
					}				
				});				
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
				if(this.health <= 0){
					this.gameReset()
					console.log()
				}
				
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

			
			
			this.players.forEach(player => {
			
			this.canvasContext.fillStyle = player.color;

			this.canvasContext.fillRect(player.paddleX, this.canvas.height-this.PADDLE_DIST_FROM_EDGE,
				this.PADDLE_WIDTH, this.PADDLE_THICKNESS);				
			});


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
		async continueToNextLevel(){
			this.setGameActive(false)
			this.dialog = false;
			let data = {xp: this.xp, coins: this.coinCount}
			await this.insertData(data)
			this.setRefreshData(true)
			this.gameReset()
		},
		gameReset(){
			this.brickReset();
			this.timerReset();
			this.brickMove = 0;
			this.BRICK_ROWS = 7
			this.blasts.forEach(el => {
				el.timer = 100
			});
			this.secondsCount = 0
			this.health = 100
			this.healthBuffer = 100
			this.brickGrid.length = this.BRICK_COLS * 7
			this.coinCount = 0
			this.coins = 0
			this.seconds = 0
			this.tenSeconds = 0
			this.minutes = 0
			this.balls.forEach(el => {
				el.score = 0;
			});
			
		},	
		timerReset(){
			this.stats[0].count = 0
			this.stats[1].count = 0
			this.stats[2].count = 0
			this.stats[0].value = 0
			this.stats[1].value = 0
			this.stats[2].value = "",
			this.secondsCheck = 0
		},
		leaveGame(){
				this.socket.emit('LEAVE_MATCH', {
					userID: this.userID
				});
				this.setGameActive(false)
		},
		keyPress(e){
				if(e.keyCode == 37){
					this.keyLeft = true
					this.keyDirection = -1
				}
				if(e.keyCode == 67){
					this.dialog = true
					this.scoreboard = true
				}
				if(e.keyCode == 39){
					this.keyRight = true
					this.keyDirection = 1
					console.log(this.allUserdata.username)
				}
				if(e.keyCode == 27){
					this.leaveGame()
				}
				if(e.keyCode == 32){
					this.balls[0].Yspeed *= -1;
					console.log(this.gameActive)
				}
				if(e.keyCode == 66){
					this.gameReset()
				}
				if(e.keyCode == 90){
					if(this.userID <= 2){
					this.userID++	
					}else{
						this.userID = 0
					}
					
				}
				this.blast(e)

		},
		keyUp(e){
			if(e.keyCode == 38){
				//up
				this.brickMoveSpeed *= 2
			}
			if(e.keyCode == 40){
				//down
				this.brickMoveSpeed *= 0.5
			}
			if(e.keyCode == 37){
				this.keyLeft = false
			}
			if(e.keyCode == 39){
				this.keyRight = false
			}	
		},
		blast(e){
		this.blasts.forEach(el => {
				if(e.keyCode == el.keyCode){
					if(el.timer < 0){
					this.balls[0].color = el.ballColor
					el.active = true
					el.backgroundFade = 0.5
					//speedball
						if(el.speedBall){
							this.ballStorage.forEach(el => {
								if(el.id > 3){
									el.Xpos = this.paddleX + this.PADDLE_WIDTH/2
									el.Ypos = this.canvas.height-this.PADDLE_DIST_FROM_EDGE-10
									el.Xspeed = 0;
									el.Yspeed =  -(window.innerHeight/250)
									this.balls.push(el)
								}
							});
							
							/*this.balls[0].Yspeed = this.balls[0].Yspeed*3
							this.balls[0].Xspeed = this.balls[0].Xspeed*3
							el.timer = 100;
								setTimeout(() => {
									this.balls[0].Yspeed = this.balls[0].Yspeed/3
									this.balls[0].Xspeed = this.balls[0].Xspeed/3
								}, 250);*/
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
									el.Xpos = this.players[0].paddleX + this.PADDLE_WIDTH/2
									el.Ypos = this.canvas.height-this.PADDLE_DIST_FROM_EDGE-10
									el.Xspeed = 0;
									el.Yspeed =  -(window.innerHeight/250)
									this.balls.push(el)
								}
							});
							if(this.newBallCount >= 6){
								el.timer = 100;
								this.newBallCount = 4
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
		this.brickGrid.forEach(el => {
			let index = this.brickGrid.indexOf(el)
			if(index >= 240 && el.exists){
				el.exists = false
				let damage = (el.fade*5)
				this.health -= damage
				this.healthBackgroundColor = "red"
				setTimeout(() =>{
				this.healthBuffer -= damage	
				}, 500)
			}
		});
		},
		addBricks(){
		if(this.brickGrid.length > 240){
			this.removeBricks()
		}
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
					if(this.brickGrid.length > 150){
						red = 255
						green = 0
					}
					if(this.brickGrid.length > 250){
						blue = 255
						red = 0
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
		cancelRequest(){
			this.socket.emit('LEAVE_GAME');
		},
		calculateCoins(){
			let coins = ((this.stats[0].value * 2 + this.stats[1].value * 7)/this.secondsCount)*20
			this.coins = Math.floor(coins)
			this.xp = this.stats[0].value * this.stats[1].value
		},

		gameFinished(){
			if(this.gameActive && this.dialog){
				if(this.stats[0].count < this.stats[0].value){
					this.stats[0].count += 1
				}
				if(this.stats[0].count == this.stats[0].value && this.stats[1].count < this.stats[1].value){
					this.stats[1].count += 1
				}
				if(this.stats[1].count == this.stats[1].value && this.secondsCheck < this.secondsCount){
					this.seconds += 1
					this.secondsCheck += 1

					if(this.seconds == 10){
						this.seconds = 0;
						this.tenSeconds += 1;
					}
					if(this.tenSeconds == 6){
						this.tenSeconds = 0;
						this.minutes += 1;
					}
					if(this.minutes == 0){
						this.stats[2].count = "00" + ":" + this.tenSeconds + this.seconds		
					}else{
						this.stats[2].count = "0" + this.minutes + ":" + this.tenSeconds + this.seconds
					}				
										
				}
				if(this.secondsCheck == this.secondsCount && this.coinCount < this.coins){
					this.coinCount++
				}

			}
		}
	},
	computed: mapGetters(['gameActive', 'allUserdata'])
	}
</script>
<style scoped>
canvas{
	position: fixed;
	z-index: +1;
	/*cursor: none;*/
	width: 100%
}
.relative{
	position:relative;
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
  animation: blinker 1.5s linear infinite;
}
@keyframes blinker {
  50% {
    opacity: 0;
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
.rome { 
	font-family: TimesNewRoman,Times New Roman,Times,Baskerville,Georgia,serif; 
}
.playerSearch {
  height: 10px;
  width: auto;
  background-color: rgb(202, 202, 202);
}
.grey{
background-color: rgb(15, 15, 15)!important;	
}
.right{
  text-align: right;
}

</style>