/*
 * @Author: xiaofan 
 * @Date: 2018-12-04 20:56:37 
 * @Last Modified by: xiaofan
 * @Last Modified time: 2018-12-04 21:36:15
 */


// let r = 2;
// r = 4;

// console.log(r);

// 不能重复定义
// const rr = 2;
// rr = 4;

// console.log(r);

// var rrr = 2;
// rrr = 4;

// console.log(r);

// 块级作用域let
// if(true) {
// 	var test = 1;
// }
// console.log(test);

// if(true) {
// 	let test1 = 1;
// }
// console.log(test1);

// 块级作用域2
// let arr = [1, 2, 3, 4];

// for (let i = 0; i < arr.length; i++) {
// }
// console.log(i)

// 箭头函数

// 没有独立作用域
// var obj = {
// 	commonFn: function () {
// 		console.log(this);
// 	},

// 	arrowFn: () => {
// 		console.log(this);
// 	}
// };

// obj.commonFn(); // this 指向obj作用域
// obj.arrowFn();	// this 指向obj所在作用域

// 剪头函数没有构造函数

// 没有prototype

// <!-- 模板字符串嵌套 -->

// let hello = 'hello';
// let getName = () => {
// 	return 'xiaofan'
// };

// let newHtml = `
// 	<div>
// 		<h1>${hello} ${getName()}</h1>
// 	</div>
// `;

// document.querySelector('body').innerHTML = newHtml;

// 循环嵌套
let names = ['xiaoming', 'xiaofan', 'daxiong'];

let hh = `
	<ul>
		${names.map(name => `<li>hello, i am ${name}</li>`).join('')}
	</ul>
`;

document.querySelector('body').innerHTML = hh;