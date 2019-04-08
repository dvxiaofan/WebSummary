(function() {
    let app = angular.module('taskManger');

    app.factory('Task', function(TaskRepository) {
        let Task = function(data) {
            this.name = data.name;
            this.completed = data.completed;
        }

        Task.prototype.complete = function() {
            console.log('完成任务: ', this.name);
            this.completed = true;
            this.save();
        };
        
        Task.prototype.save = function() {
            console.log(`saving Task: ${this.name}`);
            repo.save(this);
        };

        return Task;
    });
}());