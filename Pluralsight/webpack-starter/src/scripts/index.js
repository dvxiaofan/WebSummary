
'use strict';


var arr = ['one', 'two', 'three'];

Object.defineProperty(arr, 'last', {get: function() {
    return this[this.length - 1];
}});

var last = arr.last;

display(last);