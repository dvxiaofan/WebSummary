
'use strict';

let Task = function(data) {
    this.name = data.name;
    this.completed = false;
};

let repo = require('./taskRepository');

Task.prototype.complete = function() {
    console.log('完成任务: ', this.name);
    this.completed = true;
};

Task.prototype.save = function() {
    console.log(`saving Task: ${this.name}`);
    repo.save(this);
};

module.exports = Task;




