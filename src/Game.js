EPT.Game = function(game) {};

var map;
var tileset;
var layer;
var player;
var cursors;
var jumpButton;

const HORIZONTAL_SPEED = 100;
const VERICAL_SPEED = -250;
const DEBUG = false;
var scale = 0.4;
var UI_layer;

EPT.Game.prototype = {
	create: function() {

		//---------------------
		Phaser.Canvas.setImageRenderingCrisp(this.game.renderer.view);

		game.physics.startSystem(Phaser.Physics.ARCADE);


		//background = game.add.sprite(10, 10, 'sky');

		//  A simple background for our game
		bg = this.add.tileSprite(0  , 0, 320, 288, 'background');
		bg.fixedToCamera = true;
		console.log(bg);

		// game.stage.backgroundColor = '#787878';

		map = game.add.tilemap('mario');

		map.addTilesetImage('SuperMarioBros-World1-1', 'tiles');



		//  14 = ? block
	   	/*map.setCollisionBetween(14, 15);
		map.setCollisionBetween(15, 16);
		map.setCollisionBetween(20, 25);
		map.setCollisionBetween(27, 29);*/

		map.setCollision(10);
		map.setCollision(11);
		map.setCollision(12);
		map.setCollision(13);
		map.setCollision(14);
		map.setCollision(15);
		
		layer = map.createLayer('World1');

		
		//layer.scale.set(2,2);
		//layer.resizeWorld();

		//  Un-comment this on to see the collision tiles
		if(DEBUG)
			layer.debug = true;
		player = game.add.sprite(100, 100, 'player');
		player.smoothed = false;


		game.physics.enable(player);
		game.physics.arcade.gravity.y = 250;
		
		player.body.setSize(player.width/2, player.height, 0, 0);
		player.body.gravity.y = 200;
		player.body.linearDamping = 1;
		player.body.collideWorldBounds = true;

		// set anchor in the middle to flip in the middle
		player.anchor.setTo(.5, 1);

		// Our animations, walking left and right.
		player.animations.add('run', [6, 7, 8, 9, 10], 25, true);
		player.animations.add('idle', [0, 1, 2], 2, true);
		player.animations.add('jump', [12, 13, 14], 4, false);
		player.animations.add('shoot', [24, 25, 26], 8, false);
		player.animations.add('jump_up', [12], 4, false);
		player.animations.add('jump_down', [13], 4, false);
		player.animations.add('jump_fall', [14], 4, false);

		// Attention scale after set body
	   // player.scale.setTo(2,2);



		game.camera.follow(player);

		// Our controls.
		cursors = game.input.keyboard.createCursorKeys();
		jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		shootButton = game.input.keyboard.addKey(Phaser.Keyboard.V);
		layer.resizeWorld();
		///--------------------

		this._score = 0;
		this._time = 20;
		this.gamePaused = false;
		this.runOnce = false;

		this.currentTimer = game.time.create();
		this.currentTimer.loop(Phaser.Timer.SECOND, function() {
			this._time--;
			if(this._time) {
				//this.textTime.setText('Time left: '+this._time);
			}
			else {
				this.stateStatus = 'gameover';
			}
		}, this);
		this.currentTimer.start();

		this.initUI();
	},
	initUI: function() {

		this.buttonPause = this.add.button(30, 30, 'button-pause', this.managePause, this, 1, 0, 2);
		this.buttonPause.anchor.set(0.5,0.5);
		this.buttonPause.fixedToCamera = true;

		var fontScore = { font: "16px Arial", fill: "#000" };
		var fontScoreWhite =  { font: "16px Arial", fill: "#FFF" };
		this.textScore = this.add.text(game.camera.width-30, 40, 'Score: '+this._score, fontScore);
		this.textScore.anchor.set(1,1);
		this.textScore.fixedToCamera = true;

		//this.textTime = this.add.text(game.camera.width-50, game.camera..height-20, 'Time left: '+this._time, fontScore);
		//this.textTime.anchor.set(1,1);

		this.buttonPause.y = -this.buttonPause.height-20;
		this.buttonPause.scale.setTo(scale, scale);
		this.add.tween(this.buttonPause).to({y: 20}, 1000, Phaser.Easing.Exponential.Out, true);


		var fontTitle = { font: "32px Arial", fill: "#000", stroke: "#FFF", strokeThickness: 10 };

		this.screenPausedGroup = this.add.group();
		this.screenPausedBg = this.add.sprite(0, 0, 'overlay');
		this.screenPausedText = this.add.text(game.camera.width*0.5, 100, 'Paused', fontTitle);
		this.screenPausedText.scale.setTo(scale, scale);
		this.screenPausedText.anchor.set(0.5,0);
		this.buttonAudio = this.add.button(game.camera.width-20, 40, 'button-audio', this.clickAudio, this, 1, 0, 2);
		this.buttonAudio.anchor.set(1,0);
		this.buttonAudio.scale.setTo(scale, scale);
		this.screenPausedBack = this.add.button(75, game.camera.height-70, 'button-mainmenu', this.stateBack, this, 1, 0, 2);
		this.screenPausedBack.anchor.set(0,1);
		this.screenPausedBack.scale.setTo(scale, scale);
		this.screenPausedContinue = this.add.button(game.camera.width-75, game.camera.height-70, 'button-continue', this.managePause, this, 1, 0, 2);
		this.screenPausedContinue.anchor.set(1,1);
		this.screenPausedContinue.scale.setTo(scale, scale);
		this.screenPausedGroup.add(this.screenPausedBg);
		this.screenPausedGroup.add(this.screenPausedText);
		this.screenPausedGroup.add(this.buttonAudio);
		this.screenPausedGroup.add(this.screenPausedBack);
		this.screenPausedGroup.add(this.screenPausedContinue);
		this.screenPausedGroup.visible = false;

		this.buttonAudio.setFrames(EPT._audioOffset+1, EPT._audioOffset+0, EPT._audioOffset+2);

		this.screenGameoverGroup = this.add.group();
		this.screenGameoverBg = this.add.sprite(0, 0, 'overlay');
		this.screenGameoverText = this.add.text(game.camera.width*0.5, 100, 'Game over', fontTitle);
		this.screenGameoverText.anchor.set(0.5,0);
		this.screenGameoverBack = this.add.button(150, game.camera.height-100, 'button-mainmenu', this.stateBack, this, 1, 0, 2);
		this.screenGameoverBack.anchor.set(0,1);
		this.screenGameoverRestart = this.add.button(game.camera.width-150, game.camera.height-100, 'button-restart', this.stateRestart, this, 1, 0, 2);
		this.screenGameoverRestart.anchor.set(1,1);
		this.screenGameoverScore = this.add.text(game.camera.width*0.5, 300, 'Score: '+this._score, fontScoreWhite);
		this.screenGameoverScore.anchor.set(0.5,0.5);
		this.screenGameoverGroup.add(this.screenGameoverBg);
		this.screenGameoverGroup.add(this.screenGameoverText);
		this.screenGameoverGroup.add(this.screenGameoverBack);
		this.screenGameoverGroup.add(this.screenGameoverRestart);
		this.screenGameoverGroup.add(this.screenGameoverScore);
		this.screenGameoverGroup.visible = false;
	},
	update: function() {

		//--  
		game.physics.arcade.collide(player, layer);
		player.body.velocity.x = 0;
		playerController();

		switch(this.stateStatus) {
			case 'paused': {
				if(!this.runOnce) {
					this.statePaused();
					this.runOnce = true;
				}
				break;
			}
			case 'gameover': {
				if(!this.runOnce) {
					this.stateGameover();
					this.runOnce = true;
				}
				break;
			}
			case 'playing': {

				this.statePlaying();
			}
			default: {
			}
		}
	},
	managePause: function() {
		this.gamePaused =! this.gamePaused;
		if(EPT._audioStatus) {
			EPT._soundClick.play();
		}
		if(this.gamePaused) {
			this.stateStatus = 'paused';
		}
		else {
			this.stateStatus = 'playing';
			this.runOnce = false;
		}
	},
	statePlaying: function() {
		this.screenPausedGroup.visible = false;
		this.currentTimer.resume();


	},
	statePaused: function() {
		this.screenPausedGroup.visible = true;
		this.currentTimer.pause();
	},
	stateGameover: function() {
		this.screenGameoverGroup.visible = true;
		this.currentTimer.stop();
		this.screenGameoverScore.setText('Score: '+this._score);
		storageAPI.setHighscore('EPT-highscore',this._score);
	},
	addPoints: function() {
		this._score += 10;
		this.textScore.setText('Score: '+this._score);
		var randX = this.rnd.integerInRange(200,game.camera.width-200);
		var randY = this.rnd.integerInRange(200,game.camera.height-200);
		var pointsAdded = this.add.text(randX, randY, '+10',
			{ font: "48px Arial", fill: "#000", stroke: "#FFF", strokeThickness: 10 });
		pointsAdded.anchor.set(0.5, 0.5);
		this.add.tween(pointsAdded).to({ alpha: 0, y: randY-50 }, 1000, Phaser.Easing.Linear.None, true);
	},
	clickAudio: function() {
		if(!EPT._audioStatus) {
			EPT._soundClick.play();
		}
		EPT._manageAudio('switch',this);
	},
	stateRestart: function() {
		if(EPT._audioStatus) {
			EPT._soundClick.play();
		}
		this.screenGameoverGroup.visible = false;
		this.gamePaused = false;
		this.runOnce = false;
		this.currentTimer.start();
		this.stateStatus = 'playing';
		this.state.restart(true);
	},
	stateBack: function() {
		if(EPT._audioStatus) {
			EPT._soundClick.play();
		}
		this.screenGameoverGroup.visible = false;
		this.gamePaused = false;
		this.runOnce = false;
		this.currentTimer.start();
		this.stateStatus = 'playing';
		// this.state.restart(true);
		this.state.start('MainMenu');
	}
	};

	function playerController() {

	this.state = 'idle';

	if (cursors.left.isDown && shootButton.isUp)
	{
		//  Move to the left
		player.body.velocity.x = -1*HORIZONTAL_SPEED;

		player.animations.play('run');
		if(player.scale.x>0)
		{
			player.scale.x=-player.scale.x;
		}
	}
	else if (cursors.right.isDown && shootButton.isUp)
	{
		//  Move to the right
		player.body.velocity.x = HORIZONTAL_SPEED;

		player.animations.play('run');
		if(player.scale.x<0){
		 player.scale.x=-player.scale.x;
		}
	 }
	 else if(cursors.right.isUp && cursors.left.isUp && player.animations.name != 'shoot')
	 {
			//  Stand still
			player.animations.play('idle');
		}

		if(player.animations.frame == 26)
		{
			player.animations.play('idle');
		}

	//  Allow the player to jump if they are touching the ground.
	if (jumpButton.isDown && player.body.blocked.down)
	{
		player.body.velocity.y = VERICAL_SPEED;
		player.animations.play('jump');
	}

	if(shootButton.isDown){
		player.animations.play('shoot');

	}
	
	//on retourne en idle quand on fini le shoot
	player.events.onAnimationComplete.add(playerEndShoot, 'shoot');

	//charge le bon sprite en fction du vecteur y
   playerJumpAnimator();
}


function playerEndShoot() {
	player.animations.play('idle');
	//to do: tirer le projectile
}

function playerJumpAnimator() {

	var marge = 30;
			
   if (!player.body.blocked.down && player.animations.name != 'shoot')
	{
		if(player.body.velocity.y <= marge)
		{
			player.animations.play('jump_up');
		}
		else if(player.body.velocity.y > marge)
		{
			player.animations.play('jump_down');
		}
		
	}
}



function render() {
	
	if(DEBUG)
		game.debug.body(player);

}
