/* Arrow Function */
/* Default Parameters */

let trackCar = function(carId, city='NY') {
    console.log(`hello ${carId} in ${city}`);
};

console.log( trackCar(234) );
console.log( trackCar(543, 'BeiJing') );

