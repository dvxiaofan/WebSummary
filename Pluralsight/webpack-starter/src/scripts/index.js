/* this */
/* call and apply */

// let o = {   
//     carId: 132,
//     getId: function(prefix) {
//         // return this.carId;
//         return prefix + this.carId;
//     }
// };

// let newCar = { carId: 999 };


// // console.log( o.getId() );   // 132
// // console.log( o.getId.call(newCar) );    // 999
// console.log( o.getId.apply(newCar, ['ID: ']) );    // ID: 999


/* bind */

let b = {
    carId: 111,
    getId: function() {
        return this.carId;
    }
};

let newCar = { carId: 888 };

let newFn = b.getId.bind(newCar);

console.log(b.getId() );
console.log( newFn() );

