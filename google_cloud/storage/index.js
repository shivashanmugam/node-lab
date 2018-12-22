const config = require('./config.js')
const operations = require('./operation.js')
const op = process.argv[2];

if (op == 'upload_image') {
  const uploadImageConfig = config.operation.upload_image;
  Object.keys(uploadImageConfig.environment_variables).forEach(e => {
    process.env[e] = uploadImageConfig.environment_variables[e];
  });
  operations.uploadImage(uploadImageConfig.bucket_name, uploadImageConfig.local_file_path, uploadImageConfig.upload_options); 
}