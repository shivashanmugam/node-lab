const chalk = require('chalk');
module.exports = {
    'importJSONDataToCollection': function (data) {
        const _db = data._db;
        const dataRead = JSON.parse(data.dataRead);
        const collectionName = data.collection;
        dataRead.forEach(objToInsert => {
            _db.collection(collectionName).insertOne(objToInsert).then(data => {
                console.log(chalk.green(`Insersion succesful`));
            }).catch(err => {
                console.log(chalk.red('Error While inserting object to collection'));
                console.log(err);
                console.log(objToInsert)
            })
        });
    }
}