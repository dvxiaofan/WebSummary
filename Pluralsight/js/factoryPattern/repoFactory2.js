
let repoFactory = function() {
    let repos = this;
    let repoList = [
        { name: 'task', source: './taskRepository' },
        { name: 'user', source: './userRepository' },
        { name: 'project', source: './projectRepository' },
    ];

    repoList.forEach(repo => {
        repos[repo.name] = require(repo.source)();
    });
};

module.exports = new repoFactory;






