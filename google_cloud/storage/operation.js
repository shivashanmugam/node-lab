"use strict";
const fs = require('fs');
const chalk = require('chalk');
const _ = require('lodash');
let config = require('./config.js');
const { Storage } = require('@google-cloud/storage');
const storage = new Storage();
module.exports = {
    /* 'uploadImage' : async function (bucketName, localFilePath, uploadOptions) {
        await storage.bucket(bucketName).upload(localFilePath, uploadOptions);
        console.log(`${localFilePath} uploaded to ${bucketName}.`);
    }, */
    'uploadImage': function (bucketName, localFilePath, uploadOptions) {
        storage.bucket(bucketName).upload(localFilePath, uploadOptions).then(function(replyData){
            console.log(`${localFilePath} uploaded to ${bucketName}.`);
        }).catch(function(err){
            console.log(`Error while uploading ${localFilePath} uploaded to ${bucketName}`)
            console.log(err);
        });
        
    },
    'uploadImagesThroughFolder': function(op_name, year){
        
        const opConfig = config.operation[op_name];
        // set year
        const yearToUpload = year ? year : opConfig.year;
        // get folder path
        const localBasePath = opConfig.local_base_path + yearToUpload + '/';
        const targetBasePath = opConfig.target_base_path + yearToUpload + '/';
        const uploadOptionsBase = opConfig.upload_options_base;
        const bucketName = opConfig.bucket_name;
        // create number of upload request based on promise config and keep it inside promise.all
        const concurrentUploadLimit = opConfig.concurrent_upload_limit;

        // read all the files inside, have variable which tracks successfully uploaded files
        const filesInsideDirectory = fs.readdirSync(localBasePath);
        const alreadyUploadedFiles = JSON.parse(fs.readFileSync('./uploaded_images.json','utf8'));
        const filesToUpload = _.xor(filesInsideDirectory, alreadyUploadedFiles);
        const totalFiles = filesToUpload.length; 
        console.log(chalk.green(`No of files to be uploaded ${totalFiles}`))
        let processedFiles = [];
        let promiseSegments = [];

        function generatePromiseSegment(fileStartIndex, fileEndIndex){
            return function(){
                // Closure scope: (storage, uploadOptionsBase, targetBasePath, filesToUpload, localBasePath, fileStartIndex, fileEndIndex)
                let promiseArray = [];
                for(var fileIndex = fileStartIndex; fileIndex < fileEndIndex;fileIndex++){
                    const localFilePath = localBasePath + filesToUpload[fileIndex];

                    let uploadOptions = _.cloneDeep(uploadOptionsBase)
                    uploadOptions.destination = targetBasePath + filesToUpload[fileIndex];
                    promiseArray.push(storage.bucket(bucketName).upload(localFilePath, uploadOptions))
                }
                return promiseArray;
            }
        }

        function uploadImages(segmentArray, segmentIndex){
            Promise.all(segmentArray[segmentIndex]()).then(function(data){
                console.log(chalk.yellow(`Inside success of promise.all : segemntIndex is ${segmentIndex}`))
                logToFile(alreadyUploadedFiles.concat(filesToUpload.slice(0,(segmentIndex+1)*concurrentUploadLimit)));
            }).catch(function(err){
                console.log(err);
                console.log(chalk.redBright(`Inside error of promise.all : segemntIndex is ${segmentIndex}`))
            })

            function logToFile(processedFiles){
                fs.writeFile('uploaded_images.json',JSON.stringify(processedFiles), function(err, data){
                    if(err){
                        console.log('Error While Writing uploaded_images.json')
                        console.log(err);
                        return;
                    }
                    if(segmentArray.length !== (segmentIndex+1)) {
                        uploadImages(segmentArray, segmentIndex + 1);
                    }else {
                        console.log(chalk.redBright('SUCCESSFULLY UPLOADED ALL IMAGES'))
                         fs.writeFile('uploaded_images.json',JSON.stringify([]), function(err, data){
                            if(err){
                                console.log('Error While Writing uploaded_images.json AFTER ALL')
                                console.log(err);
                                return;
                            }
                            console.log('MADE FILE EMPTY SUCCESSFULLY')
                            if(yearToUpload !== 2018){
                                console.log(chalk.redBright(`year upload OVER FOR ${yearToUpload}`))
                                module.exports.uploadImagesThroughFolder('upload_images_through_folder', yearToUpload + 1)   
                            }else {
                                console.log(chalk.yellow('ALL YEARS UPLOADED'));
                            }
                         })
                    }
                })
            }
        }

        // creates arrray of executable functions
        for(var current = 0; current < totalFiles; current = current + concurrentUploadLimit){
            let segmentLimit;
            (current + concurrentUploadLimit) < totalFiles ? segmentLimit = current + concurrentUploadLimit : segmentLimit =  current + (totalFiles - current);
            promiseSegments.push(generatePromiseSegment(current, segmentLimit, filesToUpload))
        }

        uploadImages(promiseSegments, 0)
    }
}