/*
 * @Author: xiaofan 
 * @Date: 2018-12-04 22:20:55 
 * @Last Modified by: xiaofan
 * @Last Modified time: 2018-12-04 22:28:33
 */



let str = 'string';

let obj = {
	name: 'xiaofan'
};

let fn = () => {
	console.log('module test');	
};

export { str, obj, fn };

export default { a: 1 };