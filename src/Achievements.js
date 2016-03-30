EPT.Achievements = function(game) {};
EPT.Achievements.prototype = {
	create: function(){
		var fontAchievements = { font: "32px Arial", fill: "#000" };
		var textAchievements = this.add.text(100, 75, 'Achievements screen', fontAchievements);

		var buttonBack = this.add.button(game.camera.width-20, game.world.height-40, 'button-back', this.clickBack, this, 1, 0, 2);
		buttonBack.anchor.set(1,1);
		buttonBack.x = game.camera.width+buttonBack.width+20;
		this.add.tween(buttonBack).to({x: game.camera.width-20}, 500, Phaser.Easing.Exponential.Out, true);
	},
	clickBack: function() {
		if(EPT._audioStatus) {
			EPT._soundClick.play();
		}
		this.game.state.start('MainMenu');
	}
};