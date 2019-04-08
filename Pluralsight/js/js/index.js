
'use strict';

function Obj(name, age) {
    this.name = name;
    this.age = age;
    this.toString = function() {
        return `${this.name} is ${this.age}.`;
    };
}

let newObj = new Obj('devzhang', 23);

let Task = function(name) {
    this.name = name;
    this.completed =false;
};

Task.prototype.complete = function() {
    console.log('completing task: ', this.name);
    this.completed = true;
};

Task.prototype.save = function() {
    console.log(`saving Task: ${this.name}`);
};

let task1 = new Task('create a demo for constructor');
let task2 = new Task('create a demo for modules');
let task3 = new Task('create a demo for singletons');
let task4 = new Task('create a demo for prototypes');

task1.complete();
task2.save();
task3.save();
task4.save();



































