/*
 * @Author: xiaofan 
 * @Date: 2018-12-04 20:56:37 
 * @Last Modified by: xiaofan
 * @Last Modified time: 2018-12-04 22:20:28
 */


// 面向对象-类的继承

// 类的 constructor

// class Test {
// 	constructor(name) {
// 		this.name = name;
// 	}
// 	getName() {
// 		return this.name;
// 	}
// };

// let test = new Test('xiaom');
// console.log(test.getName());

class Test {
	constructor() {
		this.name = 'xiaoming';
	}
	getName() {
		return this.name;
	}
};

class Cat extends Test {
	constructor() {
		super();
		this.name = 'huli';
	}
};

let test = new Cat();
let tttt = new Test();
console.log(tttt.getName());
console.log(test.getName());

