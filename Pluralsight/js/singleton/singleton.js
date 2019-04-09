let TaskRepo = (function() { 
    let taskRepo;

    function createRepo() {
        let taskRepo = new Object('Task');
        return taskRepo;
    }
    return {
        getInstance: function() {
            if (!taskRepo) {
                taskRepo = createRepo();
            }
            return taskRepo;
        }
    };
})();

let repo1 = TaskRepo.getInstance();
let repo2 = TaskRepo.getInstance();

if (repo1 === repo2) {
    console.log('一样的任务实例');
} else {
    console.log('不一样');
}