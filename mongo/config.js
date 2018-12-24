'use strict';
module.exports = {
    'operation': {
        'import_json_data_to_collection': {
            'db': {
                'host': '',
                'port': '',
                'name': '',
                'username': '',
                'password': ''

            },
            'data_file': 'data_to_import.json',
            'collection_to_add_data': 'peopleDetails',
        },
        'patch_collection_data': {
            'db': {
                'host': '',//collection which will store the results of nameScrapper
                'port': '',
                'name': '',
                'username': '',
                'password': '',
            },
            'collection_to_patch': 'peopleDetails',
            'projection': {
                date: {
                    $gte: "2002-01-01T00:00:00.000Z",
                    $lt: "2019-01-01T00:00:00.000Z"
                }
            },
            // Apart from mongodb Projection this filter function will enable further more developer logical filters
            'filterAndPatchFunction' : function(data){
                const _ = require('lodash');
                const chalk = require('chalk');
                const fs = require('fs');
                try {
                    const imageDirectoryBasePath = './images/scrapped';
                    let datesToUpdate = [];
                    _.each(data, function (dateData) {
                        let date = dateData.date;
                        let people = dateData.people;
                        let path, year = new Date(date).getFullYear();
                        let affected = false;
                        _.each(people, function (person) {
                            if (person.image) {
                                path = `${imageDirectoryBasePath}/${year}/${person.entityId}.jpg`;
                                if (!fs.existsSync(path)) {
                                    affected = true;
                                    person.image = null;
                                }
                            }
                        })
    
                        if (affected) datesToUpdate.push(dateData);
                    })
                    return datesToUpdate;    
                }catch (err){
                    console.log('Error Inside filter Function');
                    throw err;
                }
            }
        }
    }
}
