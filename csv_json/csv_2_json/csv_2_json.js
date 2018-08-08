
const csv = require('csvtojson')
const fs = require('fs');
const csvFilePath = "users.csv";

let result = [];

if (!fs.existsSync(csvFilePath)) {
    console.log('File ' + csvFilePath + ' does not exist');
    process.exit();
}
csv()
    .fromFile(csvFilePath)
    .then((jsonObj) => {
        result.push(jsonObj)
        fs.writeFile('user.json', JSON.stringify(result), err => {
            if (err) throw err;
            console.log('converted csv to json');
        })
    });


