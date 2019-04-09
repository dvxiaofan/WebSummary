'use strict';

class Task {
    constructor(name) {
        this.name = name;
        this.completed = false;
    };

    complete() {
        console.log('completing task: ' + this.name);
        this.completed = true;
    };

    save() {
        console.log('saving task: ' + this.name);
    };
    
}

let task1 = new Task('create a demo for constructor');
let task2 = new Task('create a demo for modules');
let task3 = new Task('create a demo for singletons');
let task4 = new Task('create a demo for prototypes');

task1.complete();
task2.save();
task3.save();
task4.save();