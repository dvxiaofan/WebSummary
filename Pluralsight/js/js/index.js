
'use strict';

let task = {
    title: 'My task',
    description: 'My description'
};

Object.defineProperty(task, 'toString', {
    value: function() {
        return `${this.title} -- ${this.description}`;
    },
    writable: false,
    enumerable: false,  // 是否可枚举方法
    configurable: false // 是否可配置属性
});

// task.toString = 'hi';

// Object.defineProperty(task, 'toString', {
//     enumerable: true
// });

let nextTask = Object.create(task);

Object.defineProperty(nextTask, 'toString', {
    value: function() {
        return `${this.title} -- is next`;
    },
    writable: false,
    enumerable: false,  // 是否可枚举方法
    configurable: false // 是否可配置属性
});

console.log(nextTask.toString());

































