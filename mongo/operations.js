'use strict';
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
    'patchCollectionData': function (op) {
        const operationConfig = config['operation'][op];
        const dbConfig = operationConfig.db;

        Promise.all([mongConPromise(dbConfig)]).then(function (result) {
            const _db = mongoCon.getDb(result[0]);
            const collectionName = operationConfig.collection_to_patch;
            const projection = operationConfig.projection;
            const patchFunction = operationConfig.patchFunction;
            const filterAndPatchFunction = operationConfig.filterAndPatchFunction;
            _db.collection(collectionName).find(projection).toArray().then(result => {
                
                let objectsToPatch = filterAndPatchFunction(result);
                
                const totalResultCount = objectsToPatch.length;
                let resultsFixed = 0;
                let failedPatchCount = 0;
                global.value = objectsToPatch;
                
                _.each(objectsToPatch, r => {
                    _db.collection(collectionName).updateOne({ date: r.date }, { $set: r }, function (err, data) {
                        if (err) {
                            console.log(chalk.red(`Error while patching ${r.date}`))
                            failedPatchCount++;
                        }
                        console.log(chalk.green(`Out of ${totalResultCount} fixed is ${++resultsFixed} and failed is ${chalk.red(failedPatchCount)}`));
                    })
                })
            }).catch(err => {
                console.log(chalk.red('Error while finding projection'))
                throw err;
            })
        })
    }
}