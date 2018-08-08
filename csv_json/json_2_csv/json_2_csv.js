const Json2csvParser = require('json2csv').Parser;
const fs = require('fs');

const fields = ['id', 'name', 'job', 'location'];
const jsonFilePath = 'users.json';

fs.readFile(jsonFilePath, (err, data) => {
    if (err) throw err;
    else {
        data = JSON.parse(data)
        const json2csvParser = new Json2csvParser({ fields });
        const csv = json2csvParser.parse(data);
        console.log(csv);
        fs.writeFile('users.csv', csv, {
            encoding: "utf8",
        }, err  => {
            if(err) throw err;
        })
    }
})
