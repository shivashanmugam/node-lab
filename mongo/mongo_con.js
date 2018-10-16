const dbConfig = require('./config.js').db;
const dbUrl = 'mongodb://'+ dbConfig.username + ':' + dbConfig.password + '@' + dbConfig.host + ':' + dbConfig.port + '/' + dbConfig.name;
const MongoClient = require('mongodb').MongoClient;
let _db;
module.exports = {
    connectToServer: function connectToServer(callback) {
        MongoClient.connect(dbUrl, { useNewUrlParser: true }, function(err, client) {
            _db = client.db(dbConfig.name);
            return callback(err);
        });
    },
    getDb: function getDb() {
        return _db;
    }
};
