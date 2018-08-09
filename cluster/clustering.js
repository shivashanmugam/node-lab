const cluster = require('cluster');
const numOfCPUs = require('os').cpus().length;

if(cluster.isMaster){
    masterProcess();
} else {
    workerProcess()
}

function masterProcess() {
    console.log('master processes started');
    for(i = 0;i < numOfCPUs; i++){
        console.log('creating worker process ' + (i+1));
        cluster.fork(); //it creates a new node process (like running a new node main.js)
    }
}

function workerProcess() {
    console.log(`worker ${process.pid} started and I am exiting immedietly` );
    process.exit();
}