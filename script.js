// Author: Tarik Tekelioglu

var goBack = false; // The function for going back to the main menu is initially set to false.
var difficultyDisplay = false; // The function for displaying the difficulty options is initially set to false so it doesn't get displayed.
var tmpReturn = false; // This boolean is initially set to false but will be changed later.
var tempR = 255; // This value will be used for the Red part for the RGB section of the fading
var menuDisplay = true; // The menu display is initially set to true because the first thing that gets displayed when the program is run is the main menu.
var menuFadeStart = false; // The fade for the start game option in the main menu is initially set to false and will only be set to true when the start game option in the main menu is left clicked on.
var menuFadeInstructions = false; // The fade for the instrucions option in the main menu is initially set to false and will only be set to true when the instructions option in the main menu is left clicked on.
var menuFadeExit = false; // The fade for the exit option in the main menu is initially set to false and will only be set to true when the exit option in the main menu is left clicked on.
var centreX = 1000 / 2 ; // This variable just gives the x axis of the centre.
var centreY = 1000 / 2; // This variable just gives the y axis of the centre.
var menuSound = true;
var showExit = false;
var baseHealth = 0;
var gameStart = false;
var actualGame = false;
var exitTime = false;
var playerHealth = 100;
var kills = 0;
var randomTimer = 0;
var playerMovementSpeed = 10;
var gameOver = false;
var difficulty;


function setup() { // The setup function
	createCanvas(1000, 750); // Creates the canvas with the coordinates 1000, 650
	background(100); // The background value is initially set to 100.

  player = createSprite(500,600,40,40);
  player.addImage(playerShip);

  bullets = new Group();  

  enemies = new Group();

  bases = new Group();

  baseY = 750;

  // the base asset is too small. this concluded in me making a group and appending multiple base assets to give the illusion of one big wall / base.

  base = createSprite(100,baseY,100,100);
  base2 = createSprite(300,baseY,100,100);
  base3 = createSprite(500,baseY,100,100);
  base4 = createSprite(700,baseY,100,100);
  base5 = createSprite(900,baseY,100,100);

  base.addImage(baseAsset);
  base2.addImage(baseAsset);
  base3.addImage(baseAsset);
  base4.addImage(baseAsset);
  base5.addImage(baseAsset);

  // the base assets get added into a single group
  bases.add(base);
  bases.add(base2);
  bases.add(base3);
  bases.add(base4);
  bases.add(base5); 

  backgroundMusic.loop(); // the background music will loop throughout the entire game.

}

function preload() { // The preload function is used to load all the assets into the program.
	
  // images/icons
  // enemy1 = loadImage('assets/images/devil.png')
  enemy1 = loadImage('assets/images/enemyPlane.png')
  exitIcon = loadImage('assets/icons/cross.png');
  // playerShip = loadImage('assets/images/playership_blue.png'); <-- not an emoji
  playerShip = loadImage('assets/images/planeEmoji.png')
  baseAsset = loadImage('assets/images/wall.png');
  // bulletAsset = loadImage('assets/images/bullet2.png'); <-- not an emoji
  bulletAsset = loadImage('assets/images/bulletPen.png');
  gameGround = loadImage('assets/images/ground.png');
  iceGround = loadImage('assets/images/ice.png');

  // sounds
  loseSound = loadSound('assets/sounds/loseSound.wav');
  backgroundMusic = loadSound('assets/sounds/music.mp3');
  selectionSound = loadSound('assets/sounds/menuSelection.wav');
  fireSound = loadSound('assets/sounds/laserfire01.ogg');
  killSound = loadSound('assets/sounds/explosion.wav');
  playerContactSound = loadSound('assets/sounds/loseSound2.wav');

  // fonts
  menuFont = loadFont("assets/fonts/BebasNeue-Regular.otf");
  titleFont = loadFont('assets/fonts/Messages-Italic.ttf');
  difficultyFont = loadFont('assets/fonts/Quantify.ttf');
	
}

// these are variables that will be used inside the draw function.

timer = 0;
gameR = 0;
gameG = 0;
gameB = 0;
exitR = 35;
menuExitR = 255;
menuFadeR = 255;
instructionsFadeR = 225;

goR= 0;
goG = 0;
goB = 0;



function draw() { // The draw function; runs 60 times a second.

cursor();

player.scale = 0.1 // changes the size of the player sprite.
player.rotation = 315;  // rotates the player sprite since the default position is not straight.



if (gameOver == true) { // this condition deals with the game over fade and screen.

  background(goR, goG, goB);
  actualGame = false;
    
  goR += 1;
  goG += 1;
  goB += 1;

  console.log(goR, goG, goB)
  showExit = false;

  if (goR >= 200 || goG >= 200 || goB >= 200) {

    background(0);

    textSize(150)
    fill(255,101,200)
    stroke(20);
    textFont(menuFont); 
    text("Game Over", 225, 200)

    fill(255)
    textSize(100)
    textFont(menuFont)
    text("Seconds Survived: " + timer, 150,600);
    text("Total Kills: " + kills, 150, 690);


  }

}

// the 3 conditions below will determine the speed of the player according to the chosen difficulty. This is because the harder the difficulty is, the faster the enemies will be which means that the speed of the player will need to be enough to catch up with the enemies.

if (difficulty == "easy") {
  playerMovementSpeed = 10;
}
if (difficulty == "medium") {
  playerMovementSpeed = 15;
}
if (difficulty == "hard") {
  playerMovementSpeed = 18;
}



if (gameStart == true) { // this condition deals with the fade into the game once the difficulty is chosen.

  background(gameR, gameG, gameB);
    
  gameR += 1;
  gameG += 1;
  gameB += 1;

  console.log(gameR, gameG, gameB)
  showExit = false;

  if (gameR >= 255 || gameG >= 225 || gameB >= 255) {
    gameStart = false;
    actualGame = true;
    console.log("actual game is set to ", actualGame)
    gameR = 0;
    gameG = 0;
    gameB = 0;
    // resets in order to prevent the fade from not working the next time round
  }

}

if (actualGame == true) {
  // actual game code here

  // console.log("actual game is now running")

  background(gameGround) // 230

  if (baseHealth <= 0 || playerHealth <= 0) {
    gameOver = true;
  }

  fill(10);
  stroke(100);
  textSize(25);
  textFont(menuFont);
  

  text("Time elapsed: " + timer, 10,675) // this displays the timer

  if (frameCount % 60 == 0){ // this is the code that deals with the timer 
    timer += 1;
  }


  // this shows the fps (frames per second) count.
  var fps = frameRate();
  fill(10);
  stroke(200,10,182);
  textSize(30)
  textFont(menuFont)
  text("FPS: " + fps.toFixed(2), 810, 40);  

  // this displays the base health
  fill(233,21,123);
  textFont(menuFont);
  stroke(0)
  textSize(50)
  text("Base Health: " + baseHealth, 10,50)

  fill(210,10,20);

  fill(100,100,100);
  textFont(menuFont);
  stroke(0);
  textSize(30);

  
  // this displays the player health
  fill(210,10,20);
  stroke(7);
  textSize(30);
  text("Player Health: " + playerHealth, 785,675)
   
  // this displays the kills
  fill (100,20,10)
  stroke(1);
  textSize(50);
  text("Kills: " + kills, 475, 55)

  /*bases = new Group();

  baseY = 750;

  base = createSprite(100,baseY,100,3);
  base2 = createSprite(300,baseY,100,3);
  base3 = createSprite(500,baseY,100,3);
  base4 = createSprite(700,baseY,100,3);
  base5 = createSprite(900,baseY,100,3);

  base.addImage(baseAsset);
  base2.addImage(baseAsset);
  base3.addImage(baseAsset);
  base4.addImage(baseAsset);
  base5.addImage(baseAsset);

  bases.add(base);
  bases.add(base2);
  bases.add(base3);
  bases.add(base4);
  bases.add(base5); */



randomTimer += 1;

if (difficulty == "easy") {
  randomTimer += 1;
}
if (difficulty == "medium") {
  randomTimer += 1.5;
}
if (difficulty == "hard") {
  randomTimer += 2.5;
}

var randomInterval = round(random(0,1));

if (randomTimer >= 200 && randomInterval == 1) { // this is the algorithm that deals with the enemies spawning at random intervals.

  randomTimer = 0;
  // console.log("create sprite")

  // the enemy sprite is created here
  enemy = createSprite(random(0,1010), 100, 100); 
  enemy.scale = 0.12;
  enemy.rotation = 135
  enemy.addImage(enemy1);
  //enemy.setSpeed(random(5,10), 90); 
  enemy.life = 1000;

   

  // essentially, the three conditions below will determine the speed of the enemies based on the chosen difficulty by the user. It also deals with the enemies invading the base.
  if (difficulty == "easy") {
    enemy.setSpeed(random(3,5), 90);
    //enemy.life = 1000;
    //enemyBase(enemy, baseHealth)
    //console.log(enemy.position.y)

    if (enemies.overlap(bases) || enemy.position.y >= 750 || enemies.collide(bases)) {
      baseHealth -= 50;
      enemyBase(enemy, baseHealth)
    } 
  }

  if (difficulty == "medium") {
    enemy.setSpeed(random(5,7), 90)
    //enemy.life = 1000;
    //enemyBase(enemy, baseHealth)
    if (enemies.overlap(bases) || enemy.position.y >= 750 || enemies.collide(bases)) {
      baseHealth -= 50;
      enemyBase(enemy, baseHealth)
    } 
  }

  if (difficulty == "hard") {
    enemy.setSpeed(random(7,9), 90) 
    //enemyBase(enemy, baseHealth)
    // console.log(enemy.position.y)
    //console.log(enemy.life)
    //enemy.life = 2000;
    if (enemies.overlap(bases) || enemy.position.y >= 750 || enemies.collide(bases)){
      enemyBase(enemy, baseHealth)
      baseHealth -= 50;
    } 
  }



  // player.overlap(enemy, playerContactProcess);




  // the enemy sprite gets added into a group called enemies.
  enemies.add(enemy);

  /*if (bullet.overlap(enemy)) {
    enemy.remove();
    bullet.remove();
    kills ++;
    console.log("killed an enemy")
  } */

  // if the enemies overlap the bullets, the killProcess function is called.
  enemies.overlap(bullets, killProcess);


  // this deals with the contact between the player and the enemies
  if (enemies.overlap(player)) {
    // enemy.remove();
    playerHealth -= 5;
    playerContactSound.play();
    console.log("contacted")
  }

  /*bullet.setCollider("circle", 0,0,bullet.width / 2);

  bullet.collide(enemies);

  if (bullet.collide(enemy)) {
    enemy.remove();
    bullet.remove();
  } */

}  

  // all sprites are drawn here and the function that deals with the keys is also called here.
  drawSprites();
  keys();

  showExit = true;
  exitGame = true;

  if (mouseX <= 970 && mouseX >= 920 && mouseY >= 2 && mouseY <= 55) {
    cursor(HAND);
  }
  else {
    cursor();
  }

  if (player.position.x <= 20) {
    player.position.x = 20;
  }
  if (player.position.x >= 985) {
    player.position.x = 985;
  }

}

// the code that deals with the exit icon
if (showExit == true) {

  image(exitIcon, 925,10);

  if (mouseX <= 970 && mouseX >= 920 && mouseY >= 2 && mouseY <= 55) {
    cursor(HAND);
      }
  else {
    cursor();
  }

}

// the code below deals with the exit icon being clicked on
if (exitTime == true) {

  background (exitR, 0,0);
  exitR += 3;
  console.log(exitR)

  if (exitR >= 255) {
    showExit = false;
    menuDisplay = true;
    exitTime = false;
    actualGame = false;
    exitR = 0; // resets in order to prevent the fade from not working the next time round
    playerHealth = 100;
    timer = 0;
    kills = 0;

  }

}


  
  // this condition deals with the main menu display
  if (menuDisplay == true) { // If the menuDisplay variable is set to true, display the main menu.
    mainMenu();

    // All the selection below is just changing the cursor when it is hovered over the options.
 

    
    // these conditions below deal with the cursor hand changing
    if (mouseX >= 300 && mouseX <= 695 && mouseY >= 165 && mouseY <= 260) {
      cursor(HAND);
    }
    else {
      if (mouseX >= 300 && mouseX <=695 && mouseY >= 285 && mouseY <= 375) {
      cursor(HAND);
    }

    else {
          if (mouseX >= 300 && mouseX <=695 && mouseY >= 405 && mouseY <= 495) {
      cursor(HAND);
    }
    else {
      cursor()
    }
    }
    }
  }

  if (menuFadeStart == true) { 

    // The code below essentially fades red to dark red.

    background (menuFadeR, 0,0);
    menuFadeR = menuFadeR - 3;
    console.log(menuFadeR)

    if (menuFadeR <= 35) {
      // Once the arguemnt for red reaches 35/dark red, it will stop decremnting and the difficulty options will display.

      menuFadeStart = false; // Stop this function.
      difficultyDisplay = true; // Display the difficulty options.

      menuFadeR = 225; // resets in order to prevent the fade from not working the next time round
    }  
  }

  if (menuFadeInstructions == true) {

    background (instructionsFadeR, 0,0);
    instructionsFadeR = instructionsFadeR - 3;
    console.log(instructionsFadeR)

    if (instructionsFadeR <= 35) {
      menuFadeInstructions = false;
      instructionsText();
      showExit = true;

      tmpReturn = true; //okay so this part works

      instructionsFadeR = 225; // resets in order to prevent the fade from not working the next time round
    }  
  }
  
  if (menuFadeExit == true) {
    background (menuExitR, 0,0);
    menuExitR = menuExitR - 3;
    textFont(menuFont);
    textSize(200)
    text("Exiting..", 275,400)
    console.log(menuExitR)

    if (menuExitR <= 35) {
      menuFade = false;
      remove();
    }  
  }

  if (goBack == true) {

    // This function will essentially fade back from dark red to red and display the menu again.

    tmpR = 35;
    background(tempR, 0,0);
    tempR = tempR + 3;
    console.log(tempR)

    if (tempR >= 225) {
      menuFade = false;
      menuDisplay = true;
      goBack = false;

      tempR = 0; // resets in order to prevent the fade from not working the next time round
    }  

  }

  if (difficultyDisplay == true) {

    showExit = true;
    

    fill(150);
    textFont(difficultyFont);
    textSize(55);
    text("Please select a difficulty: ",185,100);

    tmpX = 325;
    tmpY = 200;

    fill(180);
    rect(tmpX,tmpY,350,100,10)
    rect(tmpX,tmpY+120,350,100,10)
    rect(tmpX,tmpY+240,350,100,10)

    fill(0);
    textFont(menuFont);
    textSize(95);
    text("Easy", 425,280);
    text("Medium", 385,400);
    text("Hard", 425,520);

    if (mouseX >= 325 && mouseX <= 675 && mouseY >= 190 && mouseY <= 300) {
      cursor(HAND);
    }
    else {
      if (mouseX >= 325 && mouseX <= 675 && mouseY >= 310 && mouseY <= 420) {
        cursor(HAND);
      }
      else {
        if (mouseX >= 325 && mouseX <= 675 && mouseY >= 435 && mouseY <= 540) {
          cursor(HAND);
        }
        else {
          if (mouseX <= 970 && mouseX >= 920 && mouseY >= 2 && mouseY <= 55) {
            cursor(HAND);
          }
          else {
            cursor();
          }
        }    
      } 
    }
  }

}
	
	// =============================================================================================

 
 // this is the function that deals with the process of killing an enemy with the bullet.
 function killProcess(enemy, bullet) {

  enemy.remove();
  bullet.remove();
  kills ++;
  killSound.play();


}  

/*function playerContactProcess() {
  playerHealth -= 5;
} */

// this function deals with the enemies invading the base.
function enemyBase(en, bhealth) {
    if (en.position.y >= 20) {
    console.log("An enemy has passed through..");
    // bhealth -= 50;
    //baseHealth -= 50;
    loseSound.play();
  }
}


function keys() { // this function deals with the keyboard controls.

  if (keyIsDown(LEFT_ARROW)) {
    player.position.x -= playerMovementSpeed;
  }
  if (keyIsDown(RIGHT_ARROW)) {
    player.position.x += playerMovementSpeed;
  }

  if (keyWentDown(32)) { // if the spacebar key is pressed, the bullet will shoot upwards in a straight line.
    bullet = createSprite(player.position.x, player.position.y-30,10,10);
    bullet.addImage(bulletAsset);
    bullet.scale = 0.05;
    bullet.rotation = 135;
    bullet.setSpeed(10, 270);
    bullet.life = 180;  
    bullets.add(bullet);
    fireSound.play();
  }

}  

function mainMenu() { // this function displays the main menu

  // This function will display the main menu.

	
	
	background(255,0,0)

	
	
	
	// ================================== Menu ====================================================


	
	fill(255)
	rect(centreX - 200,165,400,100,75) // Menu box for start game
	rect(centreX - 200,285,400,100,75) // Menu box for Instructions
	rect(centreX - 200,405,400,100,75) // Menu box for Exit
	
	// 'Start Game' text for the menu

  fill(10);
  stroke(3);
  textSize(100);
  textFont(titleFont);
  text("Lovelace Defense", 165,100)

	
	fill(0)
	textFont(menuFont)
	textSize(80)
	text("Start Game", 350, 245)
	
	// 'Display Instructions' text for the menu
	
	fill(0)
	textFont(menuFont)
	textSize(75)
	text("Instructions", 345, 365)
	
	// 'Exit Menu' text for the menu
	
	fill(0)
	textFont(menuFont)
	textSize(80)
	text("Exit Menu", 365, 480)

  fill(222,0,0)
  rect(0,0,100,1000)
  rect(900,0,100,1000)
}
		
	

function mousePressed() { // this function deals with the mouse clicks

  if (menuDisplay == true) {
    if (mouseX >= 300 && mouseX <= 695 && mouseY >= 165 && mouseY <= 260) {
      // console.log("Success")
      selectionSound.play()
      menuDisplay = false;
      startGame()
    }

    if (mouseX >= 300 && mouseX <=695 && mouseY >= 285 && mouseY <= 375) {
      selectionSound.play()
      menuDisplay = false;
      displayInstructions();
      // display instructions code here
    }

    if (mouseX >= 300 && mouseX <=695 && mouseY >= 405 && mouseY <= 495) {
      selectionSound.play()
      menuDisplay = false;
      exitGame();
      // exit the game here.
    }
  }

  /*if (mouseX >= 890 && mouseX <= 970 && mouseY >= 1 && mouseY <= 82 && tmpReturn == true) {
        selectionSound.play()
        console.log("working");
        tmpReturn = false;
        goBack = true; 

        // going back to the main menu from the instructions page
    } */
  if (difficultyDisplay == true) {

    if (mouseX >= 325 && mouseY <= 675 && mouseY >= 190 && mouseY <= 300) {
      // easy level here
      difficulty = "easy";
      selectionSound.play()
      console.log("easy")
      baseHealth = 1000;
      gameStart = true;
      difficultyDisplay = false;
    }
    if (mouseX >= 325 && mouseY <= 675 && mouseY >= 310 && mouseY <= 420) {
      // medium level here
      difficulty = "medium";
      selectionSound.play()
      console.log("medium")
      baseHealth = 750;
      gameStart = true;
      difficultyDisplay = false;
      showExit = false;
    }
    if (mouseX >= 325 && mouseY <= 675 && mouseY >= 430 && mouseY <= 540) {
      // hard level here
      difficulty = "hard";
      selectionSound.play()
      console.log("hard")
      baseHealth = 500;
      gameStart = true;
      difficultyDisplay = false;
      showExit = false;
    }
  }

  if (showExit == true) {
    if (mouseX <= 970 && mouseX >= 920 && mouseY >= 2 && mouseY <= 55) {
      difficultyDisplay = false;
      exitTime = true;
      selectionSound.play();
      showExit = false;
    }
  }
}

function menuFadeAway(type) {

  if (type == "start") {
    menuFadeStart = true;
  }
  if (type == "exit") {
    menuFadeExit = true;
  }
  if (type == "instructions") {
    menuFadeInstructions = true;
  }

  /*tempR = 255;
  
  for (x = 255 ; x >=0; x--) {
    background (tempR, 0, 0);
    tempR = tempR - 0.5;
    console.log(tempR)
  }
  */
}



function startGame() {

  menuFadeAway("start");

}

function exitGame() {
  menuFadeAway("exit");
  // exit game code
}

function displayInstructions() { 
  menuFadeAway("instructions");
}

function instructionsText() { // this function displays all the text 
  fill(255);
  textFont(menuFont);
  textSize(75);
  text("Goal:", 20,75);
  textSize(25);
  msg = "The primary goal of the game is to protect the base from the enemies for as long as possible.\n Each time the enemy makes contact with the base, the overall health of the base will decrease\n and once it reaches 0, the game will be over. Your score will be measured by the amount of time\n you manage to maintain the health of the base.";
  text(msg,75,150);
  textSize(75);
  text("Keys:", 20, 390);
  textSize(35);
  msg2 = "Spacebar: shoot\n\nLeft Arrow: move left\n\nRight Arrow: move right"
  text(msg2, 75, 450)
}