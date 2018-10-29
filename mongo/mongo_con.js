const MongoClient = require('mongodb').MongoClient;
let  _dbInstances = {};
module.exports = {
    connectToServer: function connectToServer(dbConfig, callback) {
        const dbUrl = 'mongodb://'+ dbConfig.username + ':' + dbConfig.password + '@' + dbConfig.host + ':' + dbConfig.port + '/' + dbConfig.name;
        MongoClient.connect(dbUrl, { useNewUrlParser: true }, function(err, client) {
            var _db = client.db(dbConfig.name);
            var _dbId = Math.floor(Math.random() * 1000000000);
            _dbInstances[_dbId] = _db;
            return callback(err, _dbId);
        });
    },
    getDb: function getDb(_dbId) {
        return _dbInstances[_dbId];
    }
};
