var angular = require('angular');

angular.module('todoApp', [])
  .controller('TodoListController', function() {
    var vm = this;
    vm.todos = [
      {text:'Buy Groceries', done:true},
      {text:'Sell car', done:false},
      {text:'Learn ESLint', done:false}
    ];

    vm.remaining = function() {
      var count = 0;
      angular.forEach(vm.todos, function(todo) {
        count += todo.done ? 0 : 1;
      });
      return count;
    };

  });
