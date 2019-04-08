
let repo = function() {
    let db = {};

    let get = function(id) {
        console.log(`获得当前ID: ${id}`);
        return {
            name: '来自数据库的新任务'
        };
    }

    let save = function(task) {
        console.log(`保存 ${task.name} 到数据库`);
    }
    
    return {
        get: get,
        save: save
    };
};

module.exports = repo();