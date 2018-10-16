const fs = require('fs');
const chalk = require('chalk');
const mongoCon = require('./mongo_con.js');
const operations = require('./operations.js');
const operationConfig = require('./config.js').operation;

const op = process.argv[2]; 

let mongConPromise = new Promise(function(resolve, reject){
    mongoCon.connectToServer(function (err) {
        if (err) {
            console.log('Error While Connecting mongodb');
            reject(err);
        }
        const _db = mongoCon.getDb();
        console.log(chalk.green('Connected to mongo db successfully'))
        resolve(_db);
    })
})

let fileReadPromise = new Promise(function(resolve, reject){
    fs.readFile(operationConfig[op].data_file, function(err, data){
        if(err){
            console.log('Error while Reading json file');
            reject(err);
        }
        resolve(data)
    })
})

Promise.all([mongConPromise, fileReadPromise]).then(function(result){
    const dataRead = result[1];
    const _db = result[0];
    if(op == 'import_json_data_to_collection'){
        operations.importJSONDataToCollection({'_db': _db, 'dataRead': dataRead, 'collection': operationConfig[op].data_file});
    }
}).catch(function(err){
    console.log(err)
})



