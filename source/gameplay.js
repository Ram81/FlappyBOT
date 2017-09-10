/* Create New Phaser Game for Flappy Bird on Window load */

window.onload = function(){
	var game = new Phaser.Game(1280, 720, Phaser.Canvas, 'game');

	game.state.add('Main', App.Main);
	game.state.start('Main');
}

/* ==============================
	Main Program 
   ============================== */

var App = {};

App.Main = function(game){
	this.STATE_INIT = 1;
	this.STATE_START = 2;
	this.STATE_PLAY = 3;
	this.STATE_GAMEOVER = 4;

	this.BARRIER_DISTANCE = 300;
}

/* ==============================
	TreeGroup Class
   ============================== */

var TreeGroup = function(game, parent, index){
	Phaser.Group.call(this, game, parent);

}