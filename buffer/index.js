const buf1 = Buffer.alloc(10);
const buf2 = Buffer.from('Hello World');
console.log(buf1.toJSON())
console.log(buf2.toJSON());
console.log(buf1.length)
console.log(buf2.length)

buf1.write("Buffer really rocks!") 
console.log(buf1.toString()); //Buffer Rea [Because allocated buffer size is 10]