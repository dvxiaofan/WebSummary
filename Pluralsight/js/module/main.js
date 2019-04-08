'use strict';

let Task = require('./task');
let repo = require('./taskRepository');

let task1 = new Task(repo.get(2));
let task2 = new Task({ name: '创建 modules demo' });
let task3 = new Task({ name: '创建 singletons demo' });
let task4 = new Task({ name: '创建 prototypes demo' });

task1.complete();
task2.save();
task3.save();
task4.save();