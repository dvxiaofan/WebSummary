
let repoFactory = function() {
    this.getRepo = function(repoType) {
        if (repoType === 'task') {
            if (this.taskRepo) {
                console.log('Retrieving from cache');
                return this.taskRepo;
            } else {
                this.taskRepo = require('./taskRepository')();
                return this.taskRepo;
            }
        }
        if (repoType === 'user') {
            let userRepo = require('./userRepository')();
            return userRepo;
        }
        if (repoType === 'project') {
            let projectRepo = require('./projectRepository')();
            return projectRepo;
        }
    };
};

module.exports = new repoFactory;