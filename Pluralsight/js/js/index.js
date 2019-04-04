
'use strict';

function Cat(name, color) {
    this.name = name;
    this.color = color;
}

Cat.prototype.age = 3;

let fluffy = new Cat('fluffy', 'white');

display(fluffy.__proto__);
display(fluffy.__proto__.__proto__);
display(fluffy.__proto__.__proto__.__proto__);

















































