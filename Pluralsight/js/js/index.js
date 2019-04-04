
'use strict';

function Cat(name, color) {
    this.name = name;
    this.color = color;
}

Cat.prototype.age = 3;

let fluffy = new Cat('fluffy', 'white');
let muffin = new Cat('muffin', 'brown');

fluffy.age = 8;

display(fluffy.age);
display(fluffy.__proto__.age);
display(muffin.age);

display(Object.keys(fluffy));
display(fluffy.hasOwnProperty('name'));

// Cat.prototype.age = 90;

// display(fluffy.age);
// display(fluffy.__proto__.age);
// display(Object.keys(fluffy));
// display(fluffy.hasOwnProperty('name'));



















































