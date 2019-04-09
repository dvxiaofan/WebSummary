let Task = require('./task');
let repoFactory = require('./repoFactoryCache');

let task1 = new Task(repoFactory.getRepo('task').get(1));
let task2 = new Task(repoFactory.getRepo('task').get(2));

let user = repoFactory.getRepo('user').get(1);
let project = repoFactory.getRepo('project').get(1);

task1.user = user;
task1.project = project;

//console.log(task1);
task1.save();
