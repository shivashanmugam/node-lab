const { spawn } = require('child_process');
const child = spawn('pwd');

child.stdout.on('data', function(data){
  console.log('stdout stream of child pwd')
  console.log(data);
})

child.stderr.on('data', function(data){
  console.log('stderr stream in child pwd')
  console.log(data);
})

child.on('exit', function(code, signal){
  console.log(`process existed with code ${code} and signal ${signal}`);
})

