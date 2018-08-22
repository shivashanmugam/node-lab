https://medium.freecodecamp.org/node-js-child-processes-everything-you-need-to-know-e69498fe970a

# Node.js Child Processes

spawn(), fork(), exec(), and execFile().

## Spwan
Spawned Child Processes
The spawn function `launches a command in a new process` and we can use it to pass that command any arguments. For example, here’s code to spawn a new process that will execute the `pwd` command.

```javascript
const { spawn } = require('child_process');
const child = spawn('pwd');
```

## exec 
 the spawn function does not create a shell to execute the command we pass into it. This makes it slightly more efficient than the exec function, `which does create a shell`
 
 The exec function has one other major difference. It buffers the command’s generated output and passes the whole output value to a callback function 

```javascript
const { exec } = require('child_process');

exec('find . -type f | wc -l', (err, stdout, stderr) => {
  if (err) {
    console.error(`exec error: ${err}`);
    return;
  }

  console.log(`Number of files ${stdout}`);
});
```

The exec function is a good choice if you need to use the shell syntax and if the size of the data expected from the command is small. (Remember, exec will buffer the whole data in memory before returning it.)

The spawn function is a much better choice when the size of the data expected from the command is large, because that data will be streamed with the standard IO objects.


## fork function
 The difference between spawn and fork is that a communication channel is established to the child process when using fork,
 
 Example (parent.js)
 ```javascript
 const { fork } = require('child_process');

const forked = fork('child.js');

forked.on('message', (msg) => {
  console.log('Message from child', msg);
});

forked.send({ hello: 'world' });
```
child.js
```javascript
process.on('message', (msg) => {
  console.log('Message from parent:', msg);
});

let counter = 0;

setInterval(() => {
  process.send({ counter: counter++ });
}, 1000);
```


A real example is 
when there is compute heavy computation process request comes we can place the high computation process in new file and fork it


```javascript
const http = require('http');
const { fork } = require('child_process');

const server = http.createServer();

server.on('request', (req, res) => {
  if (req.url === '/compute') {
    const compute = fork('compute.js');
    compute.send('start');
    compute.on('message', sum => {
      res.end(`Sum is ${sum}`);
    });
  } else {
    res.end('Ok')
  }
});

server.listen(3000);
```
