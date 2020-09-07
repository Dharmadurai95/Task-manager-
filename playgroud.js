const jwt = require('jsonwebtoken');
const { json } = require('express');


// let jwtFun =async (id, secret) => {

//    let token =await jwt.sign({id},secret) 
//    return token

// };
// console.log(jwtFun('Dharma@123','mysecret'))

let obje = {
   name :"Dharmadurai",
   age:"25"
}
obje.toJSON =  function () {
   console.log(this);
   return {};
}
let g = JSON.stringify(obje);
console.log(g)


