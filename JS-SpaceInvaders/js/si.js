//<!-- Space invaders script -->
//
//		Tyler Orcutt
//
//
//
//setup canvas and ctx
var canvas_width=800; //the width of our canvas
var canvas_height=600; // the height of our canvas
var ctx;


window.onload=function(){
var canvas = document.getElementById('canvas'); //set canvas to the elememt canvas
canvas.width=canvas_width; //set the canvas width
canvas.height=canvas_height; //set the canvas height

addEventListener("keydown",keydown);
addEventListener("keyup",keyup);

ctx = canvas.getContext('2d');  //set ctx to 2d context
window.setInterval(gameloop,1000/32); //call gameloop every 31.25 ms

};


//player stuff
var players=function(){
this.x=canvas_width/2-16; //start the player in the center of the x axis
this.y=canvas_height-32; //start the player up a little from the bottom
this.movingLeft=false;
this.movingRight=false;

this.isFiring=false;
this.fireCoolDown=0;
this.fireDefaultCoolDown=50;
}
var player=new players();
var score=0;
var level=1;
//Projectile stuff
var projectile = function(x,y){
this.x=x;
this.y=y;
this.isDead=false;
}
var projectiles=[];

//Enemy stufffffffffffff
var enemy= function(x,y,img_x){
this.x=x;
this.y=y;
this.img_x=img_x;
this.isDead=false;
}
var enemyDefaultMoveTimer=20;
var enemyMoveTimer=enemyDefaultMoveTimer;
var enemyMovingRight=true;

var enemies=[];
createEnemies();
//create enemys 
function createEnemies(){
	var col=0;
	var row=0;
	var imgx=0;
	for(var i=0;i<40;i++){//40 enemies
		var rand = Math.floor((Math.random()*3)+1); 
		switch(rand){
		case 1: imgx=0; break;
		case 2: imgx=32; break;
		case 3: imgx=64; break;	
		}
	var ene= new enemy(col+38,row+34,imgx);
	enemies.push(ene);
	col+=38;
		if(col>342){
		col=0;
		row+=38;
		}
	
	}
}
//Global Game Vars
var gameOver=false;

//Images
var ship = new Image();
ship.src="images/ship.png";

var enemy_img = new Image();
enemy_img.src="images/enemies.png"; 


function gameloop(){
	if(!gameOver){//is not game over
	if(player.movingLeft && player.x>4){ player.x-=3;}//is the player moving right
	if(player.movingRight&& player.x<canvas_width-34){ player.x+=3;}//is the player moving  left
	updateEnemies();//update enemies
	player.fireCoolDown--; //dec cooldown
	if(player.isFiring && player.fireCoolDown<1){//is ctrl key pressed and player can fire?
		fire();//fire ze missiles
		player.fireCoolDown=player.fireDefaultCoolDown;//rest cooldown
	}
	if(enemies.length<=0){ // are there still enemies?
	level++; //inc level
	enemies=[];// reset enemies array
	createEnemies();//create new enemys
	}
	}
	render(); //render everything
	
	if(gameOver){
		//write game over
		
	ctx.fillStyle="#FFF";
	ctx.font = "bold 40px arial";
    ctx.fillText("Game Over", canvas_width/2-100, canvas_height/2-50);
		
	}
}

function render(){ //Clears screen and redraws
ctx.beginPath();
ctx.clearRect(0,0,canvas_width,canvas_height);//clear the canvas so we can redraw!
ctx.fillStyle="#000";
ctx.fillRect(0,0,canvas_width,canvas_height);

ctx.drawImage(ship,player.x,player.y,32,32);
drawProjectiles();
drawEnemies();
drawUI();
ctx.closePath();	
}

function drawUI(){
	ctx.fillStyle="#FFF";
	ctx.font = "bold 10px arial";
ctx.fillText("Score: " + score, canvas_width-75, 10);
ctx.fillText("Level: " + level, canvas_width-75, 25);
}
function updateEnemies(){
	var moveEnemiesDown=false;
	enemyMoveTimer--;
if(enemyMoveTimer<=0){	
	for(var i=0;i<enemies.length;i++){
		if(enemyMovingRight){enemies[i].x+=3;}else{ enemies[i].x-=3;}
	//	if(enemies[i].img_x==32){ enemies[i].img_x=0}else{enemies[i].img_x=32;}
		if(enemies[i].x>=canvas_width-40 || enemies[i].x<=8){
		moveEnemiesDown=true;
		}
	}
	if(moveEnemiesDown){
			enemyMovingRight=!enemyMovingRight;
			for(var i=0;i<enemies.length;i++){
				
				enemies[i].y+=10;
				if(enemies[i].y>canvas_height-64){ gameOver=true;};
			}
	}
	enemyMoveTimer=enemyDefaultMoveTimer;
}
}

//Draw Enemies function
function drawEnemies(){

for(var i=0;i<enemies.length;i++){

ctx.drawImage(enemy_img,enemies[i].img_x,0,32,32,enemies[i].x,enemies[i].y,32,32);
	
}
}


//Draw Projectiles
function drawProjectiles(){
			
			ctx.strokeStyle="#FFF";//color of our lines
			ctx.lineWidth=1; // width of our lines
	//loop thro our projectiles
		for(var i=0;i<projectiles.length;i++){
		//check for off screen
		if(projectiles[i].y>-5 && projectiles[i].y<canvas_height){
			//move it
			projectiles[i].y-=5;
			//draw it!
			ctx.moveTo(projectiles[i].x,projectiles[i].y);
			ctx.lineTo(projectiles[i].x,projectiles[i].y-10);
			ctx.stroke();
			//check collision
			checkCollision(i);
		}else{
		//off screen, delete it!
			projectiles.splice(i,1);
			
		}
		
		}
		
}
function fire(){
	var prj= new projectile(player.x+16, player.y-3);
	projectiles.push(prj);
	
}

function checkCollision(proj){
	for(var i=0;i<enemies.length;i++){
	if(enemies[i].x+32>=projectiles[proj].x && projectiles[proj].x>=enemies[i].x
		&&enemies[i].y+32>=projectiles[proj].y && projectiles[proj].y>=enemies[i].y){
		enemies.splice(i,1);
		projectiles.splice(proj,1);
		score+=level;
		return;
	}
	}
	
}


function keydown(key){
	
	if(key.keyCode==37){
		player.movingLeft=true;
	
	}
	if(key.keyCode==39){
		player.movingRight=true;
			
	}
	if(key.keyCode==17){
		player.isFiring=true;
		
	}
	
	
}
function keyup(key){
	if(key.keyCode==37){
		player.movingLeft=false;
	}
	if(key.keyCode==39){
		player.movingRight=false;
	}
	if(key.keyCode==17){
		player.isFiring=false;
	}
}
