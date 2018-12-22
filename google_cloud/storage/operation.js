const fs = require('fs');
const chalk = require('chalk');
const _ = require('lodash');
let config = require('./config.js');
const { Storage } = require('@google-cloud/storage');
const storage = new Storage();


module.exports = {
    'uploadImage': async function (bucketName, localFilePath, uploadOptions) {
        await storage.bucket(bucketName).upload(localFilePath, uploadOptions);
        console.log(`${localFilePath} uploaded to ${bucketName}.`);
    },
}