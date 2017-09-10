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

	this.index = index;
}

/* ==============================
	Tree Class
   ============================== */

var Tree = function(game, frame){
	Phaser.Sprite.call(this, game, 0, 0, 'imgTree', frame);

	this.game.physics.arcade.enableBody(this);

	this.body.allowGravity = false;
	this.body.immovable = true;
}

Tree.prototype = Object.create(Phaser.Sprite.prototype);
Tree.prototype.constructor = Tree;

/* ==============================
	Bird Class
   ============================== */

var Bird = function(game, x, y, index){
	Phaser.Sprite.call(this, game, x, y, 'imgBird');

	this.index = index;
	this.anchor.setTo(0.5);

	//adding flap animation
	var i = index * 2;
	this.animations.add('flap', [i, i+1]);
	this.animations.add('flap', 8, true);

	//enable physics on Bird
	this.game.physics.arcade.enableBody(this);
}

Bird.prototype = Object.create(Phaser.Sprite.prototype);
Bird.prototype.constructor = Bird;

/* ==============================
	Text Class
   ============================== */

var Text = function(game, x, y, text, align, font){
	Phaser.BitmapText.call(this, game, x, y, font, text, 16);

	this.align = align;

	if(align == "right"){
		this.anchor.setTo(1, 0);
	}
	else{
		this.anchor.setTo(0.5);
	}

	this.game.add.existing(this);
}

Text.prototype = Object.create(Phaser.Sprite.prototype);
Text.prototype.constructor = Text;