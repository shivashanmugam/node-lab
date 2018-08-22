const { spawn } = require('child_process');
const { exec } = require('child_process');

const option = process.argv[2];
if (option == 'read-child-output') {
  createChildAndReadOutputStream();
} else if (option == 'main-to-child-pipe') {
  pipingInChildProcess();
} else if(option == 'exec-child'){
  childThroughExec();
}

function createChildAndReadOutputStream() {
  const child = spawn('pwd');
  let chunk = '', readableChunk;
  child.stdout.on('data', function (data) {
    chunk = chunk + data;
  })

  child.stdout.on('end', function () {
    console.log('stdout stream of child pwd')
    readableChunk = chunk.toString('utf8');
    console.log(readableChunk);
  })

  child.stderr.on('data', function (data) {
    console.log('stderr stream in child pwd')
    console.log(data);
  })

  child.on('exit', function (code, signal) {
    console.log(`process existed with code ${code} and signal ${signal}`);
  })
}

//Currently now wroking
function pipingInChildProcess() {
  const child = spawn("cat");
  process.stdin.pipe(child.stdin);
  child.stdout.on('data', function (data) {
    console.log('**Result**')
    console.log(data)
    // console.log(data.toString('utf8'))
  })

  child.stderr.on('data', function (err) {
    console.log('**Error**')
    console.log(err)
  })

  child.on('exit', function (code, signal) {
    console.log(`process existed with code ${code} and signal ${signal}`);
  })
}

// Since the exec function uses a shell to execute the command, we can use the shell syntax directly here making use of the shell pipe feature.
// a security risk if you’re executing any kind of dynamic input provided externally
function childThroughExec() {
  exec('cat abc.txt', (err, stdout, stderr) => {
    if (err) {
      console.error(`exec error: ${err}`);
      return;
    }
    console.log(`File content\n ${stdout}`);
  });
}