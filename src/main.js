
var game 
var player;
var platforms;
var cursors;
var jumpButton;

responsiveScreen();


function responsiveScreen() {

    //source du code pour la taille de la fenêtre: http://java.scripts-fr.com/scripts.php?js=23
    /*var larg = (window.innerWidth);
    var haut = (window.innerHeight);

    var ratio = larg/haut;

    console.log("Cette fenêtre fait " + larg + " de large et "+haut+" de haut, ratio= "+ratio);


     if(larg/haut>2){
       // scale = haut/hauteurBase; 
        //largeurBase=larg/scale;
        larg=2*haut;            
    }
    else if(larg/haut<0.5){
        larg=0.5*haut; 
    }*/

    game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update }, false, false);
}

function preload() {

    game.load.image('sky', 'res/img/sky.png');
    game.load.image('ground', 'res/img/platform.png');
    game.load.spritesheet('player1', 'res/img/hero.png', 16, 16);

}

function create() {

	//adaptative screen
	//	  game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;


    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  A simple background for our game
    game.add.sprite(0, 0, 'sky');

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = game.add.group();

    //  We will enable physics for any object that is created in this group
    platforms.enableBody = true;

    // Here we create the ground.
    var ground = platforms.create(0, game.world.height - 64, 'ground');

    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    ground.scale.setTo(2, 2);

    //  This stops it from falling away when you jump on it
    ground.body.immovable = true;

    //  Now let's create two ledges
    var ledge = platforms.create(400, 400, 'ground');
    ledge.body.immovable = true;

    ledge = platforms.create(-150, 250, 'ground');
    ledge.body.immovable = true;

    // The player and its settings
    player = game.add.sprite(32, game.world.height - 150, 'player1');
    player.scale.setTo(3,3);

    //set anchor in the middle to flip in the middle
    player.anchor.setTo(.5, 1);

    //  We need to enable physics on the player
    game.physics.arcade.enable(player);

    //  Player physics properties. Give the little guy a slight bounce.
    player.body.bounce.y = 0.1;
    player.body.gravity.y = 900;
    player.body.collideWorldBounds = true;

    //  Our two animations, walking left and right.
    player.animations.add('run', [6, 7, 8, 9, 10], 10, true);
    player.animations.add('idle', [0, 1, 2], 2, true);
    player.animations.add('jump', [12, 13, 14], 4, false);
    player.animations.add('shoot', [24, 25, 26], 8, false);
    player.animations.add('jump_up', [12], 4, false);
    player.animations.add('jump_down', [13], 4, false);
    player.animations.add('jump_fall', [14], 4, false);

    //  Our controls.
    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    shootButton = game.input.keyboard.addKey(Phaser.Keyboard.V);
}

//game loop
function update() {

    //  Collide the player and the stars with the platforms
    game.physics.arcade.collide(player, platforms);

    //  Reset the players velocity (movement)
    player.body.velocity.x = 0;

    playerController();

    //game.debug.body(player);
}

function playerController() {

	this.state = 'idle';

    if (cursors.left.isDown)
    {
            //  Move to the left
            player.body.velocity.x = -200;

            player.animations.play('run');
            if(player.scale.x>0){
               player.scale.x=-player.scale.x;
           }
       }
       else if (cursors.right.isDown)
       {
        //  Move to the right
        player.body.velocity.x = 200;

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
    if (jumpButton.isDown && player.body.touching.down)
    {
        player.body.velocity.y = -550;
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

    var marge = -50;
    if (!player.body.touching.down && player.animations.name != 'shoot')
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
