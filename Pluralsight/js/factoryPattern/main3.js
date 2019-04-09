let Task = require('./task');
let repoFactory = require('./repoFactory2');

let task1 = new Task(repoFactory.task.get(1));
let task2 = new Task(repoFactory.task.get(2));

let user = repoFactory.user.get(1);
let project = repoFactory.project.get(1);

task1.user = user;
task1.project = project;

//console.log(task1);
task1.save();
