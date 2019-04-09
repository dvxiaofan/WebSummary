
let repo = function() {
    let db = {};

    let get = function(id) {
        console.log('Getting user ' + id);
        return {
            name: 'Jon Mills'
        };
    };

    let save = function(user) {
        console.log('Saving ' + user.name + ' to the db');
    };

    return {
        get: get,
        save: save
    };
};

module.exports = repo;