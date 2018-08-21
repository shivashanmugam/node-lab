var fs = require('fs')

var option = process.argv[2];

if(option == 'pipe'){
    pipeExample();
}else if (option == 'read'){
    readExample()
}else if (option == 'read-event'){
    readWithEventHandler();
}

//reads abc.txt and write in bcd.txt
function pipeExample() {
    var readable = fs.createReadStream('abc.txt');
    var writable = fs.createWriteStream('bcd.txt');
    readable.pipe(writable);
    readable.on('end', function () {
        readable.unpipe(writable);
    });
}

//allows us to add encoding while printing chunk and enables to mention max of each stream read
function readExample() {
    var readable = fs.createReadStream('abc.txt');
    readable._read(20); //each time the stream will read 20 bytes max
    readable.setEncoding('utf8');
    var streamLine = 1;
    readable.on('data', function (chunk) {
        console.log(`streamline ${streamLine} \n\n`);
        console.log(chunk);
    });
}

function readWithEventHandler() {
    var readable = fs.createReadStream('abc.txt');
    readable.on('data', function (chunk) {
        console.log('got %d bytes of data', chunk.length);
    });
    readable.on('error', function (error) {
        console.log('Error while getting data', error);
    });

    readable.on('end', function () {
        console.log('no more data to read');
    });
    readable.on('close', function () {
        console.log('resource closed');
    })
}