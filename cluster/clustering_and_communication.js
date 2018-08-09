const cluster = require('cluster');
const numOfCPUs = require('os').cpus().length;
const workers = [];
if(cluster.isMaster){
    masterProcess();
} else {
    workerProcess()
}

function masterProcess() {
    console.log('master processes started');
    for(i = 0;i < numOfCPUs; i++){
        console.log('creating worker process ' + (i+1));
        var worker = cluster.fork()
        workers.push(worker)
        worker.on('message', function(msg){
            console.log(`MESSAGE FROM WORKER ${worker.id}`)
            console.log(JSON.stringify(msg))
        })
    }

    workers.forEach(function(worker){
        console.log(`sending message to worker ${worker.id}`)
        worker.send( { message : `Hi I am your master ${process.pid}`});
    })
}

function workerProcess() {
    console.log(`worker ${process.pid} started` );
    process.on('message', function(msg){
        console.log(`MESSAGE FROM MASTER`)
        console.log(JSON.stringify(msg))
    })

    setTimeout(function(){
        console.log(`sending message to master from worker ${process.pid}`)
        process.send({message:`Hi I am your worker ${process.pid}`});
    }, 500)   
}