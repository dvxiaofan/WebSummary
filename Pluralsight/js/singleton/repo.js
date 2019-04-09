let repo = function() {
    let called = 0;
    let save = function(task) {
        called ++;
        console.log('保存 ' + task + ' 调用 ' + called + ' 次');
    };

    console.log('创建新的任务库');

    return {
        save: save
    };
};

module.exports = new repo();