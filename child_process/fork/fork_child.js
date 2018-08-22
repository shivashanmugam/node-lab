process.on('message', (msg) => {
  console.log(`FATHER :  ${msg}`);
});

let counter = 1;

setInterval(() => {
  process.send('Father, I dont want to go to hell, forgive my sin number ' + counter++);
}, 1000);