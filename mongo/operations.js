const fs = require('fs');
const chalk = require('chalk');
const _ = require('lodash');
let config = require('./config.js');
const mongoCon = require('./mongo_con.js');


let mongConPromise = function (dbConfig) {
    return new Promise(function (resolve, reject) {
        mongoCon.connectToServer(dbConfig, function (err, dbInstanceId) {
            if (err) {
                console.log('Error While Connecting mongodb');
                reject(err);
            }
            console.log(chalk.green('mongodb://' + dbConfig.username + ':' + dbConfig.password + '@' + dbConfig.host + ':' + dbConfig.port + '/' + dbConfig.name + '  -- Connected to mongo db successfully'))
            resolve(dbInstanceId);
        })
    })
}

let fileReadPromise = function (file_path) {
    return new Promise(function (resolve, reject) {
        fs.readFile(file_path, function (err, data) {
            if (err) {
                console.log('Error while Reading json file');
                reject(err);
            }
            resolve(data)
        })
    })
}

module.exports = {
    'importJSONDataToCollection': function (op) {
        const operationConfig = config['operation'][op];
        const dbConfig = operationConfig.db;
        
        Promise.all([mongConPromise(dbConfig), fileReadPromise(operationConfig.data_file)]).then(function (result) {
            const dataRead = JSON.parse(result[1])
            const _db = mongoCon.getDb(result[0]);
            const collectionName = operationConfig.collection_to_add_data;
            const totalObjects = dataRead.length;
            let insertedObjects = 0;
            let failedToInsert = 0;
            dataRead.forEach(objToInsert => {
                _db.collection(collectionName).insertOne(objToInsert).then(data => {
                    console.log(chalk.yellow(`Insersion succesful for ${++insertedObjects} out of ${totalObjects}`) + chalk.red(` So far Failed ${failedToInsert}`));;
                }).catch(err => {
                    ++failedToInsert;
                    console.log(chalk.red('Error While inserting object to collection'));
                    console.log(err);
                    console.log(objToInsert)
                })
            });
        }).catch(function (err) {
            console.log(err)
        })
    },
    'migrationFromOneDbCollectionToAnotherDbDollection': function (op) {
        const [ readConfig, writeConfig ] = [config.operation[op]['read'], config.operation[op]['write'] ];
        Promise.all([mongConPromise(readConfig.db)]).then(result => {
            const readDbInstance = mongoCon.getDb(result[0])
            readDbInstance.collection(readConfig.collection).find(readConfig.projection).toArray().then(data => {
                let result = [];
                _.each(data, d => {
                    if(readConfig.arrayToInsert){
                        result = result.concat(readConfig.arrayToInsert({d, readConfig}))
                    }
                })
                fs.writeFile('db_migration.json',JSON.stringify(result), (err) => {
                    if(err) {
                        console.log(chalk.red('ERROR while writing result of db migration data'));        
                        throw err;
                    }
                    let importJsonDataConfig = config.operation['import_json_data_to_collection'];
                    importJsonDataConfig.data_file = 'db_migration.json';
                    importJsonDataConfig.db = writeConfig.db;
                    importJsonDataConfig.collection_to_add_data = writeConfig.collection_to_add_data;
                    module.exports.importJSONDataToCollection('import_json_data_to_collection');
                })
            })
        }).catch(err => {
            console.log(chalk.red('Error while connecting to DB'))
            throw err
        })
    }
}