# Implementation of Flappy Bird Bot using Neural Network and Genetic Algorithm.

Here is the source code for a HTML5 project that implements a machine learning algorithm in the Flappy Bird video game using neural networks and a genetic algorithm. The program teaches a little bird how to flap optimally in order to fly safely through barriers as long as possible.

All code is written in HTML5 using [Phaser framework](http://phaser.io/) and [Synaptic Neural Network library](https://synaptic.juancazala.com) for neural network implementation.

![Flappy Bird Screenshot](https://raw.githubusercontent.com/ram81/FlappyBot/master/screenshots/flappy_10.png "Flappy Bird Screenshot")

## Neural Network Architecture

To play the game, each unit (bird) has its own neural network consisted of the next 3 layers:
1. an input layer with 2 neurons presenting what a bird sees:
     
     ```
     1) horizontal distance between the bird and the closest gap
     2) height difference between the bird and the closest gap
     ```
     
2. a hidden layer with 6 neurons
3. an output layer with 1 neuron used to provide an action as follows:
     
     ```
    if output > 0.5 then flap else do nothing
     ```
     
![Flappy Bird Neural Network](https://raw.githubusercontent.com/ram81/FlappyBot/master/screenshots/flappy_06.png "Flappy Bird Neural Network")


There is used [Synaptic Neural Network library](https://synaptic.juancazala.com) to implement entire artificial neural network instead of making a new one from the scratch.

## The Main Concept of Machine Learning

The main concept of machine learning implemented in this program is based on the neuro-evolution form. It uses evolutionary algorithms such as a genetic algorithm to train artificial neural networks. Here are the main steps:

1. create a new population of 10 units (birds) with a **random neural network** 
2. let all units play the game simultaneously by using their own neural networks
3. for each unit calculate its **fitness** function to measure its quality as:

    ```
    fitness = total travelled distance - distance to the closest gap
    ```
 
    ![Flappy Bird Fitness](https://raw.githubusercontent.com/ram81/FlappyBot/master/screenshots/flappy_08.png "Flappy Bird Fitness")

    
4. when all units are killed, evaluate the current population to the next one using **genetic algorithm operators** (selection, crossover and mutation) as follows:

    ```
    1. sort the units of the current population in decreasing order by their fitness ranking
    2. select the top 4 units and mark them as the winners of the current population
    3. the 4 winners are directly passed on to the next population
    4. to fill the rest of the next population, create 6 offsprings as follows:
        - 1 offspring is made by a crossover of two best winners
        - 3 offsprings are made by a crossover of two random winners
        - 2 offsprings are direct copy of two random winners
    5. to add some variations, apply random mutations on each offspring.
    ```
    
5. go back to the step 2

## Implementation

### Requirements

Since the program is written in HTML5 using [Phaser framework](http://phaser.io/) and [Synaptic Neural Network library](https://synaptic.juancazala.com) you need these files:

- **phaser.min.js**
- **synaptic.min.js**
The implementation currently works only for firefox, feel free to add support for chrome browser. This project is based on the concept of evolutionary training of Neural Networks with the help of Genetic Algorithm.

