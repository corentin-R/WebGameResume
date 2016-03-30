EPT.MainMenu = function(game) {};
EPT.MainMenu.prototype = {
	create: function() {
		var scale = 0.40;
		game.add.tileSprite(0  , 0, 320, 288, 'background');

		var title = this.add.sprite(game.camera.width*0.5, (game.camera.height-100)*0.5, 'title');
		title.anchor.set(0.5);
		title.scale.setTo(scale, scale);
		storageAPI.initUnset('EPT-highscore', 0);
		var highscore = storageAPI.get('EPT-highscore') || 0;

		var buttonStart = this.add.button(game.camera.width-20, game.camera.height-20, 'button-start', this.clickStart, this, 1, 0, 2);
		buttonStart.anchor.set(1);
		buttonStart.scale.setTo(scale, scale);

		this.buttonAudio = this.add.button(game.camera.width-20, 20, 'button-audio', this.clickAudio, this, 1, 0, 2);
		this.buttonAudio.anchor.set(1,0);
		this.buttonAudio.scale.setTo(scale, scale);

		var buttonAchievements = this.add.button(20, game.camera.height-20, 'button-achievements', this.clickAchievements, this, 1, 0, 2);
		buttonAchievements.anchor.set(0,1);
		buttonAchievements.scale.setTo(scale, scale);

		var fontHighscore = { font: "16px Arial", fill: "#000" };
		var textHighscore = this.add.text(game.camera.width*0.5, game.camera.height-20, 'Highscore: '+highscore, fontHighscore);
		textHighscore.anchor.set(0.5,1);

		EPT._manageAudio('init',this);

		buttonStart.x = game.camera.width+buttonStart.width+20;
		this.add.tween(buttonStart).to({x: game.camera.width-20}, 500, Phaser.Easing.Exponential.Out, true);
		this.buttonAudio.y = -this.buttonAudio.height-20;
		this.add.tween(this.buttonAudio).to({y: 20}, 500, Phaser.Easing.Exponential.Out, true);
		buttonAchievements.y = game.camera.height+buttonAchievements.height+20;
		this.add.tween(buttonAchievements).to({y: game.camera.height-20}, 500, Phaser.Easing.Exponential.Out, true);
	},
	clickAudio: function() {
		if(!EPT._audioStatus) {
			EPT._soundClick.play();
		}
		EPT._manageAudio('switch',this);
	},
	clickStart: function() {
		if(EPT._audioStatus) {
			EPT._soundClick.play();
		}
		this.game.state.start('Story');
	},
	clickAchievements: function() {
		if(EPT._audioStatus) {
			EPT._soundClick.play();
		}
		this.game.state.start('Achievements');
	}
};