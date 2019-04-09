let Task = require('./task');
let taskRepo = require('./taskRepository');
let userRepo = require('./userRepository');
let projectRepo =   require('./projectRepository');

let task1 = new Task(taskRepo.get(1));

let user = userRepo.get(1);
let project = projectRepo.get(1);

task1.user = user;
task1.project = project;

console.log(task1);
task1.save();
