// Le constructeur Personne
var gameEntity = function(nom, imgPath) {
	this.nom = nom;
	game.load.image(nom, imgPath);
};

gameEntity.prototype.draw = function(x,y){
	console.log('Je marche !');
};
gameEntity.prototype.direBonjour = function(){
	console.log('Bonjour, je suis '+this.nom);
};
