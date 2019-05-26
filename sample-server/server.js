const express = require('express')
const path = require('path');
const app = express()
const port = 3005
var MongoClient = require('mongodb').MongoClient;
var dbInstance;

// connection to db
MongoClient.connect("mongodb://localhost:27017/testdb", function (err, db) {
    if (err) throw err;
    dbInstance = db;
    // page configuration
    app.get('/', (req, res) => res.sendfile('./pages/home.html'))
    app.get('/karthi', (req, res) => res.sendfile('./pages/karthi.html'))


    app.get('/userdetail', (req, res) => {
        var users = dbInstance.collection("users")
        users.find({}).toArray().then(function (result) {
            res.render('./users.ejs', { 'users': result, 'test' : {'name' : 'siva'} })
        })
    })
});

var filePath = {
    public: {
        'js': './public/js',
        'css': './public/css',
        'images': './public/image'
    }
}

app.set('views', path.join(__dirname, '/pages'));
app.use(express.static('public'))
app.set('view engine', 'ejs');



app.listen(port, () => console.log(`Example app listening on port ${port}!`))