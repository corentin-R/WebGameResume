var game = new Phaser.Game(320, 288, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render }, null, null);

function preload() {

    game.load.tilemap('mario', 'res/tilemaps/world1.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles', 'res/tiles/tilemap1.png');
    game.load.spritesheet('player', 'res/img/hero.png', 18, 16);

	game.load.image('background', 'res/img/background_xl.png');


}

var map;
var tileset;
var layer;
var player;
var cursors;
var jumpButton;

const HORIZONTAL_SPEED = 100;
const VERICAL_SPEED = -250;
const DEBUG = false;

function create() {


	Phaser.Canvas.setImageRenderingCrisp(this.game.renderer.view);
	//game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;;


    game.physics.startSystem(Phaser.Physics.ARCADE);

        //  A simple background for our game
    bg = game.add.tileSprite(0, 0, 800, 600, 'background');
    bg.fixedToCamera = true;
    //background = game.add.sprite(10, 10, 'sky');

    game.stage.backgroundColor = '#787878';

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
    
    //layer.scale.set(1.5,1.5);
     layer.resizeWorld();

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
    //player.scale.setTo(1.4,1.4);


    game.camera.follow(player);

    // Our controls.
    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    shootButton = game.input.keyboard.addKey(Phaser.Keyboard.V);

}

function update() {

    game.physics.arcade.collide(player, layer);

    player.body.velocity.x = 0;

    playerController();

}

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
            console.log(player.body.velocity.y)
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