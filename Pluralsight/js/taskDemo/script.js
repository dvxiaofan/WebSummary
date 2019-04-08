(function() {
    let repo = angular.module('taskManger', []);

    let taskController = function(Task) {
        let ctrl = this;
        ctrl.tasks = [new Task({ name: 'task1' }), new Task({ name: 'task2', complete: false })];
    };

    repo.controller('taskCtrl', taskController);
}())