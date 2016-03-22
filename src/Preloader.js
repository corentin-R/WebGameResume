EPT.Preloader = function(game) {};
EPT.Preloader.prototype = {
	preload: function() {
		var preloadBG = this.add.sprite((this.world.width-580)*0.5, (this.world.height+150)*0.5, 'loading-background');
		var preloadProgress = this.add.sprite((this.world.width-540)*0.5, (this.world.height+170)*0.5, 'loading-progress');
		this.load.setPreloadSprite(preloadProgress);
		
		this._preloadResources();
	},
	_preloadResources() {
		var pack = EPT.Preloader.resources;
		for(var method in pack) {
			pack[method].forEach(function(args) {
				var loader = this.load[method];
				loader && loader.apply(this.load, args);
			}, this);
		}
	},
	create: function() {
		this.state.start('MainMenu');
	}
};
EPT.Preloader.resources = {
	'image': [
		['background', 'res/img/background_xl.png'],
		['title', 'res/img/title.png'],
		['logo-enclave', 'res/img/logo-enclave.png'],
		['clickme', 'res/img/clickme.png'],
		['overlay', 'res/img/overlay.png'],
		['background', 'res/img/background_xl.png'],
		['tiles', 'res/tiles/tilemap1.png']
	],
	'spritesheet': [
		['button-start', 'res/img/button-start.png', 180, 180],
		['button-continue', 'res/img/button-continue.png', 180, 180],
		['button-mainmenu', 'res/img/button-mainmenu.png', 180, 180],
		['button-restart', 'res/img/button-tryagain.png', 180, 180],
		['button-achievements', 'res/img/button-achievements.png', 110, 110],
		['button-pause', 'res/img/button-pause.png', 80, 80],
		['button-audio', 'res/img/button-sound.png', 80, 80],
		['button-back', 'res/img/button-back.png', 70, 70],
		['player', 'res/img/hero.png', 18, 16]
	],
	'audio': [
		['audio-click', ['res/audio/audio-button.m4a','res/audio/audio-button.mp3','res/audio/audio-button.ogg']]
	],
	'tilemap':[
		['mario', 'res/tilemaps/world1.json', null, Phaser.Tilemap.TILED_JSON]
	]
};

