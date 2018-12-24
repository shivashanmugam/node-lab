'use strict';
const operations = require('./operations.js');
const op = process.argv[2];
const express = require('express');
/* -------------------- initiating server and request handler ----------------------  */
global.value, global.json;
var app = express(),
server = app.listen(8080);

app.get('/getjson', function(req, res) {
  res.send(value);
})

app.get('/readjson', function(req, res) {
  res.send(json);
})


if (op == 'import_json_data_to_collection') {

    operations.importJSONDataToCollection('import_json_data_to_collection');
    
} else if(op == 'patch_collection_data') {

    operations.patchCollectionData('patch_collection_data')

}






