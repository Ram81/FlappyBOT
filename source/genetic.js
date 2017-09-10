/*  ===========================
	Genetic Algorithm Implementation
	=========================== */

var GeneticAlgorithm = function(max_units, top_units) {
	// Total Number of input units & top units
	this.max_units = max_units;
	this.top_units = top_units;

	if(this.max_units < this.top_units)
		this.top_units = this.max_units;

	this.Population = [];

	//Normalization Factor
	this.SCALE_FACTOR = 200;
}

GeneticAlgorithm.prototype = {
	// Reset GA Parameters
	reset : function(){
		// initial number of iteration & mutation rate
		this.iteration = 1;
		this.mutateRate = 1;

		// population number, fitness & score of best unit
		this.best_population = 0;
		this.best_fitness = 0;
		this.best_score = 0;
	},

	//create new population
	createPopulation : function(){
		//clear existing population
		this.Population.splice(0, this.Population.length);

		for(var i = 0; i<this.max_units; i++){
			//Create a New unit using a random Synaptic Neural Network 
			// with 2 neuron input layer, 6 input hidden layer, 1 output unit
			var newUnit = new synaptic.Architect.Perceptron(2, 6, 1);

			//set paramters
			newUnit.index = i;
			newUnit.fitness = 0;
			newUnit.score = 0;
			newUnit.isWinner = false;

			this.Population.push(newUnit);
		}
	},

	activateBrain : function(bird, target) {
		// Input 1 : Horizontal Distance Between Bird & target
		var targetDeltaX = this.normalize(target.x, 700) this.SCALE_FACTOR;

		// Input 2 :Vertical Difference between Bird& target
		var targetDeltaY = this.normalize(bird.y - target.y, 800) * this.SCALE_FACTOR;

		// Create Array of inputs;
		var inputs = [targetDeltaX, targetDeltaY];

		// Calculate output by activating Synaptic neural network
		var outputs = this.Population[bird.index].activate(inputs);

		if(outputs[0] > 0.5)
			bird.flap();
	},

	// Evolves Population by performing selection, crossover & mutation over units;
	evolvePopulation : function() {
		// Select top units of current population to get winners
		var Winners = this.selection();

		if(this.mutateRate == 1 && Winners[0].fitness < 0){
			// If the best unit from the initial population has a negative fitness 
			// then it means there is no any bird which reached the first barrier!
			this.createPopulation();
		}
		else{
			this.mutateRate = 0.2;
		}

		// fill next population
		
	},
}