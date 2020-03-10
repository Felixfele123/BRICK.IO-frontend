<template>

<canvas id="scene" @mouseover="increaseFlow()" @mouseleave="decreaseFlow()"></canvas>


</template>


<script>
export default {

  name: 'UserBrick',
  data: () => ({

    width:null, // Width of the canvas
    height: null, // Height of the canvas
    rotation: 0, // Rotation of the globe
    dots: [], // Every dots in an array

    DOTS_AMOUNT: 1500, // Amount of dots on the screen
    DOT_RADIUS: null, // Radius of the dots
    GLOBE_RADIUS: null, // Radius of the globe
    GLOBE_CENTER_Z: null, // Z value of the globe center
    PROJECTION_CENTER_X: null, // X center of the canvas HTML
    PROJECTION_CENTER_Y: null, // Y center of the canvas HTML
    FIELD_OF_VIEW: null,

    brick_posY: null,
    brick_posX: null,
    brick_speed: 1,
    BRICK_WIDTH: null,
    BRICK_HEIGHT: null,
    counter: 0,
    randomArr: [],

    dotClass: null,
    dotFlow: 30,
    createDot: 0,
    loopDot: 0,
    i: 0,

    canvas: null,
    ctx: null,



  }),
  created(){
      window.addEventListener('resize', this.onResize);

// Populate the dots array with random dots

// Render the scene
    window.requestAnimationFrame(this.render);

  },

  mounted(){





      this.canvas = document.getElementById('scene')
      this.ctx = this.canvas.getContext('2d')
      this.width = this.canvas.clientWidth
      this.height = this.canvas.clientHeight

      this.DOT_RADIUS = this.height/250
      this.GLOBE_RADIUS = this.width * 0.7
      this.GLOBE_CENTER_Z = -this.GLOBE_RADIUS
      this.PROJECTION_CENTER_X = this.width / 2
      this.PROJECTION_CENTER_Y = this.height / 2

      this.FIELD_OF_VIEW = this.width * 0.8

      this.brick_posY = this.canvas.clientHeight*0.3
      this.brick_posX = this.canvas.clientWidth*0.4

      this.BRICK_WIDTH = this.canvas.clientWidth/5
      this.BRICK_HEIGHT = this.canvas.clientHeight/20

        if (window.devicePixelRatio > 0) {
        this.canvas.width = this.canvas.clientWidth * 2;
        this.canvas.height = this.canvas.clientHeight * 2;
        this.ctx.scale(2, 2);
        }

        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;

        this.canvas.addEventListener('hover', this.increaseFlow);

        class Dot {
            constructor(x, y, z, checkOne, counter) {
                this.x = x;
                this.y = y;
                this.z = z;
                this.checkOne = checkOne
                this.counter = counter
                
                this.xProject = 0;
                this.yProject = 0;
                this.sizeProjection = 0;
            }
            
            // Do some math to project the 3D position into the 2D canvas
            project(sin, cos) {
                const rotX = cos * this.x + sin * (this.z - this.GLOBE_CENTER_Z);
                const rotZ = -sin * this.x + cos * (this.z - this.GLOBE_CENTER_Z) + this.GLOBE_CENTER_Z;
                this.sizeProjection = this.FIELD_OF_VIEW / (this.FIELD_OF_VIEW - rotZ);
                this.xProject = (rotX * this.sizeProjection) + this.PROJECTION_CENTER_X;
                this.yProject = (this.y * this.sizeProjection) + this.PROJECTION_CENTER_Y;
            }
            // Draw the dot on the canvas
            draw(sin, cos) {


                this.project(sin, cos);
                // ctx.fillRect(this.xProject - DOT_RADIUS, this.yProject - DOT_RADIUS, DOT_RADIUS * 2 * this.sizeProjection, DOT_RADIUS * 2 * this.sizeProjection);


            }
        }

          this.dots.length = 0;
  let i;
  // Create a new dot based on the amount needed
  for (i = 0; i < this.DOTS_AMOUNT; i++) {
    const theta = Math.random() * 2 * Math.PI; // Random value between [0, 2PI]
    const phi = Math.acos((Math.random() * 2) - 1); // Random value between [-1, 1]
    
    // Calculate the [x, y, z] coordinates of the dot along the globe
    const x = this.GLOBE_RADIUS * Math.sin(phi) * Math.cos(theta);
    const y = this.GLOBE_RADIUS * Math.sin(phi) * Math.sin(theta) * 0.2;
    const z = (this.GLOBE_RADIUS * Math.cos(phi)) + this.GLOBE_CENTER_Z;
    const checkOne = true
    const counter = true
    if(y > - 20){
      this.dots.push(new Dot(x, y, z, checkOne, counter));
    }
  }
this.genRanArr();
  },
  methods: {
    
    render(a) {
  // Clear the scene
  this.ctx.clearRect(0, 0, this.width, this.height);
  
  // Increase the globe rotation
  let rotation = a * 0.0004;
  
  const sineRotation = Math.sin(rotation); // Sine of the rotation
  const cosineRotation = Math.cos(rotation); // Cosine of the rotation
  this.drawBrick();
  // Loop through the dots array and draw every dot
  let i;
  for (i = 0; i < this.dots.length; i++) {

                const rotX = cosineRotation * this.dots[i].x + sineRotation * (this.dots[i].z - this.GLOBE_CENTER_Z);
                const rotZ = -sineRotation * this.dots[i].x + cosineRotation * (this.dots[i].z - this.GLOBE_CENTER_Z) + this.GLOBE_CENTER_Z;
                let sizeProjection = this.FIELD_OF_VIEW / (this.FIELD_OF_VIEW - rotZ);
                let xProject = (rotX * sizeProjection) + this.PROJECTION_CENTER_X;
                let yProject = (this.dots[i].y * sizeProjection) + this.PROJECTION_CENTER_Y;
  
                this.ctx.fillStyle = 'grey';
                this.ctx.beginPath();
                this.ctx.arc(xProject, yProject, this.DOT_RADIUS * sizeProjection, 0, Math.PI * 2);
                this.ctx.closePath();
                this.ctx.fill();

  }
  
  this.randomArr.forEach(el => {
    if(this.dots[el].y){
      this.dots[el].y -= 1
    }
    
    this.dots[el].counter++

    if(this.dots[el].y < -50){
      if(this.dots[el].checkOne){
        let random = Math.floor(Math.random() * this.dots.length)
        this.randomArr.push(random)
        this.dots[el].checkOne = false
      }
    }
    if(this.dots[el].y < -200){
      this.dots[el].y += this.dots[el].counter
      this.dots[el].counter = 0;
    }
  });


  this.brick_posY += this.brick_speed
  if(this.brick_posY > this.height/2.8){
    this.brick_speed -= 0.05;
  }else{
    this.brick_speed += 0.05;
  }

  window.requestAnimationFrame(this.render);
},
   
    drawBrick(){
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(this.brick_posX,this.brick_posY,this.BRICK_WIDTH,this.BRICK_HEIGHT);
},
    genRanArr(){
        for(this.i=0; this.i < this.dotFlow; this.i++){
        let random = Math.floor(Math.random() * 50)
        this.randomArr.push(random)
        }
},
    
    afterResize () {
        this.width = this.canvas.offsetWidth;
        this.height = this.canvas.offsetHeight;
        if (window.devicePixelRatio > 1) {
            this.canvas.width = this.canvas.clientWidth * 2;
            this.canvas.height = this.canvas.clientHeight * 2;
            this.ctx.scale(2, 2);
        } else {
            this.canvas.width = this.width;
            this.canvas.height = this.height;
        }
        this.GLOBE_RADIUS = this.width * 0.7;
        this.GLOBE_CENTER_Z = -this.GLOBE_RADIUS;
        this.PROJECTION_CENTER_X = this.width / 2;
        this.PROJECTION_CENTER_Y = this.height / 2;
        this.FIELD_OF_VIEW = this.width * 0.8;
        
},

// Variable used to store a timeout when user resized its screen
// Function called right after user resized its screen
onResize () {
  this.afterResize()
  this.randomArr = []
  this.createDots(); // Reset all dots
},
increaseFlow(){
  this.dotFlow = 300;
  this.DOT_RADIUS *= 2;
  this.randomArr = [];
  this.genRanArr();
  console.log('hover')
},
decreaseFlow(){
  this.dotFlow = 30;
  this.DOT_RADIUS *= 0.5;
  this.randomArr = [];
  this.genRanArr();
}
      },
      
};
</script>

<style>

  #scene {
    width:50%;
    padding-left: 0;
    padding-right: 0;
    margin-left: auto;
    margin-right: auto;
    display: block;
    z-index: +2;
  }
</style>