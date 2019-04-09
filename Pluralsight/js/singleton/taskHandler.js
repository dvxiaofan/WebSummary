let myrepo = require('./repo');

let taskHandler = function() {
    return {
        save: function() {
            myrepo.save('来自任务处理器');
        }
    };
};

module.exports = taskHandler();