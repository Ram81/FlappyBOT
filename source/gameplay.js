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

App.Main.prototype = {
	preload : function(){
		this.game.load.spritesheet('imgBird', 'contents/img_bird.png', 36, 36, 20);
		this.game.load.spritesheet('imgTree', 'contents/img_tree.png', 90, 400, 2);
		this.game.load.spritesheet('imgButtons', 'contents/img_buttons.png', 110, 40, 3);

		this.game.load.image('imgTarget', 'contents/img_target.png');
		this.game.load.image('imgGround', 'contents/img_ground.png');
		this.game.load.image('imgPause', 'contents.img_pause.png');
		this.game.load.image('imgLogo', 'contents/img_logo.png');

		this.game.load.bitmapFont('fnt_chars_black', 'contents/fnt_chars_black.png', 'contents/fnt_chars_black.fnt');
		this.game.load.bitmapFont('fnt_digits_blue', 'contents/fnt_digits_blue.png', 'contents/fnt_digits_blue.fnt');
		this.game.load.bitmapFont('fnt_digits_red', 'contents/fnt_digits_red.png', 'contents/fnt_digits_red.fnt');
		this.game.load.bitmapFont('fnt_digits_green', 'contents/fnt_digits_green.png', 'contents/fnt_digits_green.fnt');
	},

	create : function(){
		//set scale mode for entire screen
		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.scale.pageAlignVertically = true;
		this.scale.pageAlignHorizontally = true;

		//set background color
		this.game.stage.background = "#89bfdc";

		//keep game running in case it loses focus
		this.game.stage.disableVisibilityChange = true;

		//start Phaser's physics engine
		this.game.physics.startSystem(Phaser.Physics.Arcade);

		//set gravity
		this.game.physics.arcade.gravity.y = 1300;

		//create new Genetic Algorithm
		this.GA = new GeneticAlgorithm(10, 4);

		//create BirdGroup
		this.BirdGroup = this.game.add.group();
		for(var i = 0; i < this.GA.max_units; i++) {
			this.BirdGroup.add(new Bird(this.game, 0, 0, i));
		}

		//create BarrierGroup which contains number of TreeGroup of Top & Bottom Trees
		this.BarrierGroup = this.game.add.group();
		for(var i = 0; i<4; i++){
			new TreeGroup(this.game, this.BarrierGroup, i);
		}

		//Create Traget Point Sprite
		this.TargetPoint = this.game.add.sprite(0, 0, 'imgTarget');
		this.TargetPoint.anchor.setTo(0.5);

		//Create a GroundPoint Scrolling Object
		this.Ground = this.game.add.tileSprite(0, this.game.height - 100, this.game.width - 370, 100, 'imgGround');
		this.Ground.autoScroll(-200,0);

		//Create a BitMap Image for Showing Heads up display
		this.bmdStatus = this.game.make.bitmapData(370, this.game.height);
		this.bmdStatus.addToWorld(this.game.width - this.bmdStatus.width, 0);

		//Create text Object to Display
		new text(this.game, 1047, 10, "In1 In2 Out", "right", "fnt_chars_black");
		this.txtPopulationPrev = new Text(this.game, 1190, 10, "", "right", "fnt_chars_black");
		this.txtPopulationCur = new Text(this.game, 1270, 10, "", "right", "fnt_chars_black");

		//Create Objects of Birds & Show their status in Heads-Up display
		this.txtStatusPrevGreen = [];	//details of top units of previous population
		this.txtStatusPrevRed = [];		//details of weak units of previous population
		this.txtStatusCur = [];			//details of units of current population

		for(var i = 0; i<this.GA.max_units; i++){
			var y = 46 + i * 50;

			new Text(this.game, 1110, y, "Fitness:\nScore:", "right", "fnt_chars_black");
			this.txtStatusPrevGreen.push(new Text(this.game, 1190, y, "", "right", "fnt_digits_green"));
			this.txtStatusPrevRed.push(new Text(this.game, 1190, y, "", "right", "fnt_digits_red"));
			this.txtStatusCur.push(new Text(this.game, 1270, y, "", "right", "fnt_digits_blue"));
		}

		//create new Text object for Best Bird int the population
		this.txtBestUnit = new Text(this.game, 1095, 580, "", "center", "fnt_chars_black");

		//create Buttons
		this.btnRestart = this.game.add.button(920, 620, 'imgButtons', this.onRestartClick, this, 0, 0);
		this.btnMore = this.game.add.button(1040, 620, 'imgButtons', this.onMoreGamesClick, this, 2, 2);
		this.btnPause = this.game.add.button(1160, 620, 'imgButtons', this.onPauseClick, this, 1, 1);
		this.btnLogo = this.game.add.button(910, 680, 'imgLogo', this.onMoreGamesClick, this);

		//create Game Pause Info
		this.sprPause = this.game.add.sprite(455, 360, 'imgpause');
		this.sprPause.anchor.setTo(0.5);
		this.sprPause.kill();

		//Adding Input Listener
		this.game.input.onDown.add(this.onResumeClick, this);

		//Set Initial State
		this.state = this.STATE_INIT;
	},

	getNextBarrier : function(index) {
		return this.BarrierGroup.getAt((index + 1) % this.BarrierGroup.length);
	},

	onDeath : function(bird) {
		this.GA.population[bird.index].fitness = bird.fitness_cur;
		this.GA.population[bird.index].score = bird.score_cur;

		bird.death();
		if(this.BirdGroup.countLiving() == 0) 
			this.state = this.STATE_GAMEOVER;
	},

	onRestartClick : function() {
		this.state = this.STATE_INIT;
	},

	onMoreGamesClick : function() {
		window.open("http://www.askforgametask.com", "_blank");
	},

	onPauseClick : function() {
		this.game.paused = true;
		this.btnPause.input.reset();
		this.sprPause.revive();
	},

	onResumeClick : function() {
		if(this.game.paused){
			this.game.paused = false;
			this.btnPause.input.enabled = true;
			this.sprPause.kill();
		}
	}
}

/* ==============================
	TreeGroup Class
   ============================== */

var TreeGroup = function(game, parent, index){
	Phaser.Group.call(this, game, parent);

	this.index = index;

	//Create and Add Top & Bottom Tree to the Group
	this.topTree = new Tree(this.game, 0);
	this.bottomTree = new Tree(this.game, 1);

	this.add(this.topTree);
	this.add(this.bottomTree);
}

TreeGroup.prototype = Object.create(Phaser.Sprite.prototype);
TreeGroup.prototype.constructor = TreeGroup;

TreeGroup.prototype.restart = function(x){
	this.topTree.reset(0, 0);
	this.bottomTree.reset(0, this.topTree.height + 130);

	this.x = x;
	this.y = this.game.rnd.integerInRange(110 - this.topTree.height, -20);

	this.setAll('body.velocity.x', -200);
}

TreeGroup.prototype.getWorldX = function(){
	return this.topTree.world.x;
}

TreeGroup.prototype.getGapX = function(){
	return this.bottomTree.world.x + this.bottomTree.width;
}

TreeGroup.prototype.getGapY = function(){
	return this.bottomTree.world.y - 65;
}

/* ==============================
	Tree Class
   ============================== */

var Tree = function(game, frame) {
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

var Bird = function(game, x, y, index) {
	Phaser.Sprite.call(this, game, x, y, 'imgBird');

	this.index = index;
	this.anchor.setTo(0.5);

	//adding flap animation & playing it
	var i = index * 2;
	this.animations.add('flap', [i, i+1]);
	this.animations.play('flap', 8, true);

	//enable physics on Bird
	this.game.physics.arcade.enableBody(this);
}

Bird.prototype = Object.create(Phaser.Sprite.prototype);
Bird.prototype.constructor = Bird;

Bird.prototype.restart = function(iteration){
	this.fitness_prev = (iteration == 1) ? 0 :this.fitness_cur;
	this.fitness_cur = 0;

	this.score_prev = (iteration == 1) ? 0 : this.score_cur;
	this.score_cur = 0;

	this.alpha = 1;
	this.reset(150, 300 + this.index * 20);
}

Bird.prototype.flap = function(){
	this.body.velocity.y = -400;
}

Bird.prototype.death = function(){
	this.alpha = 0.5;
	this.kill();
}

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

Text.prototype = Object.create(Phaser.BitmapText.prototype);
Text.prototype.constructor = Text;