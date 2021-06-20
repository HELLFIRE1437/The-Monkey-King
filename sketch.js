var monkey , monkey_running ,monkey_wounded;
var banana ,bananaImage, obstacle, obstacleImage ;
var bananaGroup, obstacleGroup ;
var ground, bg , bgImg;
var score = 0;
var size_score = 0;
var power_on = false;
var gameState = "instructions";
var gameover,overImg;
var restart,restartImg;

function preload(){  
  monkey_running = loadAnimation("sprite_0.png","sprite_1.png","sprite_2.png","sprite_3.png",
  "sprite_4.png","sprite_5.png","sprite_6.png","sprite_7.png","sprite_8.png")
  monkey_wounded = loadAnimation("monkey.png");
  bananaImage = loadImage("banana.png");
  obstacleImage = loadImage("obstacle.png");
  bgImg = loadImage("bg6.webp");
  overImg = loadImage("gameover.png");
  restartImg = loadImage("restart.png");

}



function setup() {
  
  createCanvas(500,400)
  bg = createSprite(350,220);
  bg.addImage("bg",bgImg);
  bg.scale = 2 ;
  bg.velocityX = -3;
  monkey = createSprite(100 , 350 , 30,30);
  monkey.addAnimation("running-",monkey_running);
  monkey.addAnimation("wounded",monkey_wounded);
  monkey.scale = 0.18;
  //monkey.debug = true;
  monkey.setCollider("rectangle",0,25,500,650);
  ground = createSprite(300, 390  , 650 , 20);
  ground.velocityX = -3;
  ground.visible = false;
  bananaGroup = createGroup();
  obstacleGroup = createGroup();
  gameover = createSprite(240,130);
  gameover.addImage("over",overImg);

}


function draw() {

  background("white");

  drawSprites();

  scoring();
  
  if(gameState === "instructions"){
    textSize(20);
    fill("orange");
    text("Catch bananas using Up Arrow key or Space key",30,40,450,100);
    text("Feeding on bananas grows the monkey",30,90,450,100);
    text("At Maximum size you have an extra life",30,140,450,100);
    text("Hitting rocks while max size shrinks you again",30,190,450,100);
    text("Avoid Hitting Rocks when not at max size !!",30,240,450,100);
    textSize(15);
    text("Press Up Arrow or Space to start game",250,310,200,100);
    screen_reset();
    gameover.visible = false ;
    monkey.visible = true ;
    monkey.y = 350 ;
    monkey.scale = 0.16 ;
    if(keyWentDown("Space")){
      gameState = "play";
    }
  }

  if(gameState === "play"){

    gameover.visible = false; 

    bg.velocityX = -3;
    
    monkey.visible = true;

    screen_reset();

    if((keyDown("Space") || keyDown(UP_ARROW)) && monkey.y > 310){
      //console.log("hi")
      monkey.velocityY = -17;
    }

    if(monkey.isTouching(bananaGroup)){
      score += 2;
      if(size_score != 22){ //actual 30 
        size_score += 2;
      }
      bananaGroup.destroyEach();
    }

    monkey.velocityY = monkey.velocityY + 0.7; 
    monkey.collide(ground);
    
    if(monkey.isTouching(obstacleGroup)){
      obstacleGroup.destroyEach();
      if(power_on === false){
        gameState = "end";
      }
      if(power_on === true){
        size_score = 0;
        power_on = false;
      }      
    }
    //console.log(size_score);
    switch (size_score) {
      case 0:  
        monkey.scale = 0.10;
        obstacleGroup.setScaleEach(0.15);
        break;
      case 6: //actual 6
        monkey.scale = 0.12;
        obstacleGroup.setScaleEach(0.17);
        break;
      case 10: //actual 10
        monkey.scale = 0.14;
        obstacleGroup.setScaleEach(0.18)
        break;
      case 20: //actual 20
        monkey.scale = 0.16;
        obstacleGroup.setScaleEach(0.2);
        break;
      case 22: // actual 30
        monkey.scale = 0.18;
        obstacleGroup.setScaleEach(0.23);
        power_on = true;
        break;
      default:
        break;
    }

    bananas();
    obstacles();

  }

  if(gameState === "end"){
    gameover.visible = true;
    monkey.visible = false;
    bg.velocityX = 0;
    monkey.velocityY = 0;
    ground.velocityX = 0;
    bananaGroup.destroyEach();
    bananaGroup.setVelocityXEach(0);
    obstacleGroup.setVelocityXEach(0);
    bananaGroup.setLifetimeEach(-1);
    obstacleGroup.setLifetimeEach(-1);
    /*monkey.changeAnimation("wounded");
    monkey.scale = 0.3;*/
    textFont("Algerian");
    text("Press 'Space' to restart",125,225,250,250);
    if(keyWentDown("Space")){
      score = 0;
      size_score = 0;
      gameState = "instructions";
    }
    
  }   

}
function bananas(){
  if(frameCount % 80 === 0 ){
    banana = createSprite(500 ,  Math.round(random(95,215), 20 , 20));
    banana.velocityX = -7 ;
    banana.addImage("banana",bananaImage);
    banana.scale = 0.15
    banana.lifetime = 200;
    bananaGroup.add(banana);
  }
}
function obstacles(){
  if(frameCount % 190 === 0){    
    obstacle = createSprite(500,335 ,20,20);
    obstacle.addImage("rock",obstacleImage);
    obstacle.scale = 0.15
    obstacle.setCollider("circle" , 0 , 0 , 200);
    obstacle.velocityX = - 6 ;
    obstacle.lifetime = 220;
   // obstacle.debug = true;
    obstacleGroup.add(obstacle);
  }
}
function screen_reset(){
  background.velocityX = -3
  if(ground.x < 275){
    ground.x = ground.width / 2;
  }
  if(bg.x < 110){
    bg.x = 350;
  }
}
function scoring(){
  fill("yellow");
  textAlign("center");
  textSize(30);
  if(gameState === "end"){
    //fill("red")
    text("Score : " + score , 240 , 195);
    fill("yellow");
  }
  if(gameState === "play"){
    text("Score : " + score , 405 , 60);
  }
  
}



