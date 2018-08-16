const fs = require('fs');
console.log('--------------------------ASYNC example------------------------');
async function asyncFunction() {
    return 'Hi I am a Async function example, I am just promise function internally\n\n';
}


/* Expansion 1
 async function asyncFunction() {
     Promise.resolve('Hi I am a Async function example, I am just promise function internally\n\n');
 }
*/


/* Expansion 2
let asyncFunction = new Promise(function (resolve, reject) {
    Promise.resolve('Hi I am a Async function example, I am just promise function internally\n\n');
})
*/


asyncFunction().then(function (data) {
    console.log(data);
})


async function asyncFunction_1() {
    let readFile = new Promise(function (resolve, reject) {
        setTimeout(() => {
            console.log('--------------------------AWAIT example------------------------');
            resolve('Hi I am await example and I execute by awaiting until settimeout callback triggers, Note : I only await for  asyncrouns events, for syncrnous I throw error');
        }, 1000);
    })
    const result = await readFile;
    console.log(result);
}
asyncFunction_1();