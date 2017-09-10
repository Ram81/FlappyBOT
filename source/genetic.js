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

