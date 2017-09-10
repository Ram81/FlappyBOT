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
		for(var i = this.top_units; i<this.max_units; i++){
			var parA, parB, offspring;

			if(i == top_units){
				parA = Winners[0].toJSON();
				parB = Winners[1].toJSON();
				offspring = this.crossOver(parA, parB);
			}
			else if(i < this.max_units - 2){
				// offspring is made by crossover over to two random winner
				parA = this.getRandomUnit(Winners).toJSON();
				parB = this.getRandomUnit(Winners).toJSON();
				offspring = this.crossOver(parA, parB);
			}
			else{
				offspring = this.getRandomUnit(Winners).toJSON();
			}

			// mutate offsrping
			offspring = this.mutation(offspring);

			var newUnit = synaptic.Network.fromJSON(offspring);
			newUnit.index = this.Population[i].index;
			newUnit.fitness = 0;
			newUnit.score = 0;
			newUnit.isWinner = false;

			this.Population[i] = newUnit;
		}

		// if top winner has the best fitness in the history, store
		if(Winners[0].fitness > best_fitness){
			this.best_population = this.iteration;
			this.best_fitness = Winners[0].fitness;
			this.best_score = Winners[0].score;
		}

		this.Population.sort(function(unitA, unitB) {
			return unitA.index - unitB.index;
		});
	},

	//Select Best Unit
	selection : function() {
		// Sort Population
		var sortedPopulation = this.Population.sort(function(unitA, unitB) {
			return unitB.fitness - unitA.fitness;
		});

		// Mark winners
		for(var i = 0; i<this.top_units; i++)
			this.Population[i].isWinner = true;

		return sortedPopulation.slice(0, this.top_units);
	},

	crossOver : function(parA, parB) {
		// get a cross over cutting point
		var cutPoint = this.random(0, parA.neurons.length - 1);

		for(var i = cutPoint; i<parA.neurons.length; i++){
			var biasFromParA = parA.neurons[i]['bias'];
			parA.neurons[i]['bias'] = parB.neurons[i]['bias'];
			parB.neurons[i]['bias'] = biasFromParA;
		}

		return this.random(0, 1) == 1 ? parA : parB;
	},

	mutation : function(offspring) {

		for(var i = 0; i<offspring.neurons.length; i++){
			offspring.neurons[i]['bias'] = this.mutate(offspring.neurons[i]['bias'])
		}

		for(var i = 0; i<offspring.connections.length; i++){
			offspring.connections[i]['weight'] = this.mutate(offspring.connections[i]['weight']);
		}

		return offspring;
	},

	mutate : function(gene) {
		if(Math.random() < this.mutateRate){
			var mutateFactor = 1 + ((Math.random() - 0.5) * 3 + (Math.random() - 0.5));
			gene *= mutateFactor;
		}

		return gene;
	},

	random : function(min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	},

	getRandomUnit : function(array) {
		return array[this.random(0,array.length - 1)];
	},

	normalize : function(value, max) {
		if(value < -max)
			value = -max;
		else if(value > max)
			value = max;
		
		return value/max;
	}
}