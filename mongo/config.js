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
        'migration_from_one_db_collection_to_another_db_collection': {
            'read': {
                'db': {
                    'host': '',
                    'port': '',
                    'name': '',
                    'username': '',
                    'password': ''
                },
                'collection': 'peopleDetails',
                'projection': { 'year': 1918 },
                'arrayToInsert': function (data) {
                    const fs = require('fs');
                    const locationDetails = JSON.parse(fs.readFileSync('./location.json', 'utf8'));
                    let year = data.readConfig.projection.year;
                    data = data.d;
                    let arrayToInsert = [];
                    let dateObject = {};
                    data.people.forEach(function (p) {
                        try {
                            // prevents ( not = null, month is zero +1918-00-00T00:00:00Z, date is zero +1918-03-00T00:00:00Z, sometimes wrong birthday is persons present, for example for 1918 birth person's DOB contains +1919-03-00T00:00:00Z)
                            if (p.DOB && parseInt(p.DOB.substr(6, 2)) != 0 && parseInt(p.DOB.substr(9, 2)) && parseInt(p.DOB.substr(1, 4)) == year) {
                                if (p.DOD && parseInt(p.DOD.substr(6, 2)) != 0 && parseInt(p.DOD.substr(9, 2))) {
                                    p.DOD = new Date(p.DOD.substr(1, p.DOD.length)).toISOString();
                                }
                                let pob = new Date(p.DOB.substr(1, p.DOB.length)).toISOString();
                                p.DOB = pob;
                                if(p.POB){
                                    // Some entity ids like 10602808 is currently not having label value in english https://www.wikidata.org/w/api.php?action=wbgetentities&ids=Q10602808|Q31&props=labels&languages=en&format=json
                                    if(locationDetails[p.POB.toString()] != undefined){
                                        p.POB = locationDetails[p.POB.toString()];
                                    }
                                }
                                if(p.citizen){
                                    if(locationDetails[p.citizen.toString()] == undefined){
                                        throw 'locationDetails[p.citizen.toString()] is undefined';
                                    }
                                    p.citizen = locationDetails[p.citizen.toString()];
                                }
                                if(p.gender){
                                    switch (p.gender) {
                                        case 6581097:
                                        p.gender = 'Male';
                                        break;
                                        case 6581072 :
                                        p.gender = 'Female';
                                        break;
                                        case 1052281:
                                        p.gender = 'Transgender Female';
                                        break;
                                        case 2449503:
                                        p.gender = 'Transgender Female';
                                        break;
                                        case 1097630:
                                        p.gender = 'Intersex';
                                        break;
                                    }
                                }
                                if (!dateObject[pob]) {
                                    dateObject[pob] = []
                                }
                                dateObject[pob].push(p)
                            }
                        } catch (err) {
                            console.log('ERROR while array manipulation')
                            console.log(p);
                            console.log(err);
                            process.exit();
                        }
                    })
                    Object.keys(dateObject).forEach(function (d) {
                        arrayToInsert.push({ 'date': d, 'people': dateObject[d] })
                    })
                    return arrayToInsert;
                },
            },
            'write': {
                'db': {
                    'host': '',
                    'port': '',
                    'name': '',
                    'username': '',
                    'password': ''
                },
                'collection_to_add_data': 'peopleDetails'
            }
        }
    }
}
