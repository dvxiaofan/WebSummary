
let repoFactory = function () {

    this.getRepo = function (repoType) {
        if (repoType === 'task') {
            let taskRepo = require('./taskRepository')();
            return taskRepo;
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