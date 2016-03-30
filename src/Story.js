EPT.Story = function(game) {};
EPT.Story.prototype = {
	create: function(){
		var scale = 0.40;
		var textStory = this.add.text(75, 75, 'Story screen', { font: "32px Arial", fill: "#000" });
		var buttonContinue = this.add.button(game.camera.width-50, game.world.height-40, 'button-continue', this.clickContinue, this, 1, 0, 2);
		
		buttonContinue.anchor.set(1,1);
		buttonContinue.x = game.camera.width+buttonContinue.width+20;
		buttonContinue.scale.setTo(scale, scale);

		
		this.add.tween(buttonContinue).to({x: game.camera.width-20}, 500, Phaser.Easing.Exponential.Out, true);
	},
	clickContinue: function() {
		if(EPT._audioStatus) {
			EPT._soundClick.play();
		}
		this.game.state.start('Game');
	}
};
