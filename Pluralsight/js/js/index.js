
'use strict';

function Animal(voice) {
    this.voice = voice || 'grunt';
}

Animal.prototype.speak = function() {
    display('grunt');
};

function Cat(name, color) {
    Animal.call(this);

    this.name = name;
    this.color = color;
} 

Cat.prototype = Object.create(Animal.prototype);

let fluffy = new Cat('fluffy', 'white');

display(fluffy); 











































