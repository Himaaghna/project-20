var PLAY = 1;
var END = 0;
var gameState = PLAY;

var warrior, warrior_running;
var ground, groundImage;

var obstaclesGroup, obstacle, enemy, wall, tree, well;

var score;

var gameOverImg, restartImg;
var checkPointSound;

function preload() {
  warrior_running = loadImage("warrior.png1.png");

  groundImage = loadImage("ground.png");

  enemy = loadImage("enemy.png");
  wall = loadImage("wall.png");
  tree = loadImage("tree.png");
  well = loadImage("well.png");

  restartImg = loadImage("restart.png");
  gameOverImg = loadImage("gameOver.png");
 
  checkPointSound = loadSound("checkPoint.mp3");
}

function setup() {
  createCanvas(600, 200);

  warrior = createSprite(50, 10, 20, 50);
  warrior.addImage("running", warrior_running);

  ground = createSprite(200, 255 , 400, 20);
  ground.addImage("ground", groundImage);
  ground.x = ground.width / 2;

  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);

  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
  gameOver.scale = 1;
  restart.scale = 0.08;
  

  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  
  //console.log("Hello" + 5);
  
  warrior.setCollider("circle",0,0,40);
  warrior.debug = false;
  
  score = 0;
}

function draw() {
  background(264,193,13);
  //displaying score
  fill("red");
  text("Score: "+ score, 500,50);
  
  //console.log("this is ",gameState)



  if(gameState === PLAY){
    
  
  //jump when the space key is pressed
  if (keyDown("space") && warrior.y >= 100) {
    warrior.velocityY = -11 ;
  }

  //move the ground
  ground.velocityX =  -(4+2*score/100);

  if (ground.x < 0) {
    ground.x = ground.width / 2;
  }

  gameOver.visible = false
    restart.visible = false
    
    //scoring
    score = score + Math.round(getFrameRate()/60);
      
    //add gravity
    warrior.velocityY = warrior.velocityY +0.8;

     //spawn obstacles on the ground
     spawnObstacles();

     //stop trex from falling down
  warrior.collide(ground);
   
    if (score> 0 &&score%100===0) {
      checkPointSound.play();
    }
    
    if(obstaclesGroup.isTouching(warrior)){
        gameState = END;
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
     
      ground.velocityX = 0;
      warrior.velocityY = 0
     
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
     obstaclesGroup.setVelocityXEach(0);

     
  if(mousePressedOver(restart)) {
    reset();
  }
     
   }

  drawSprites();
}

function reset() {
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;

  obstaclesGroup.destroyEach();
  score = 0;
}

function spawnObstacles() {
  if (frameCount % 130 === 0) {
    var obstacle = createSprite(600, 160 , 10, 40);
    obstacle.velocityX =  -(5+2*score/100);

    //generate random obstacles
    var rand = Math.round(random(1, 4));
    switch (rand) {
      case 1:
        obstacle.addImage(enemy);
        break;
      case 2:
        obstacle.addImage(wall);
        break;
      case 3:
        obstacle.addImage(tree);
        break;
      case 4:
        obstacle.addImage(well);
        break;
      default:
        break;
    }

    //assign scale and lifetime to the obstacle
    obstacle.scale=0.2;
    obstacle.lifetime = 300;

    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}


