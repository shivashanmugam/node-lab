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
                    $gte: "1974-12-15T00:00:00.000Z",
                    $lt: "1974-12-16T00:00:00.000Z"
                }
            },
            'patchFunction': function (objectToPatch) {
                const _ = require('lodash');

                function sortOut(peopleArray, properties) {
                    let newArray = [];
                    let indexToRemove = [];
                    _.each(peopleArray, function (a, peopleIndex) {
                        let valid = true;
                        _.each(properties, function (p) {
                            if (!a[p]) {
                                valid = false;
                            }
                        })
                        if (valid) {
                            newArray.push(a);
                            indexToRemove.push(peopleIndex);
                        }
                    })
                    newArray = _.sortBy(newArray, [function (o) { return o.totalClaims; }]).reverse();
                    return { 'sorted': newArray, 'indexToRemove': indexToRemove };
                }

                function removePeopleThroughIndex(peopleIndexesToRemove) {
                    _.each(peopleIndexesToRemove, function (i, soFarRemoved) {
                        people.splice(i - soFarRemoved, 1)[0].entityId;
                    })
                }

                const people = objectToPatch.people;
                const totalPeople = people.length;
                let newPeopleArray = [];
                let result;

                let sortProperties = ['image', 'description', 'citizen', 'POB', 'DOD'];
                for (let j = 0; j < sortProperties.length; j++ , sortProperties.splice(0, 1)) {
                    let sortPropertiesClone = _.cloneDeep(sortProperties);
                    for (let i = 0; i < sortPropertiesClone.length; i++ , sortPropertiesClone.splice(sortPropertiesClone.length - 1, 1)) {
                        result = sortOut(people, sortPropertiesClone);
                        newPeopleArray = newPeopleArray.concat(result.sorted);
                        removePeopleThroughIndex(result.indexToRemove)
                    }
                }

                newPeopleArray = newPeopleArray.concat(_.sortBy(people, function(p){ return p.totalClaims}).reverse())
                if (totalPeople != newPeopleArray.length) {
                    console.log(totalPeople + '-------' + newPeopleArray.length)
                    throw 'Error While Sorting things'
                }
                objectToPatch.people = newPeopleArray;
                return objectToPatch;
            }
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
                'projection': { 'year': 2018 },
                'arrayToInsert': function (data) {
                    const fs = require('fs');
                    const locationDetails = JSON.parse(fs.readFileSync('./location.json'));
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
                                if (p.POB) {
                                    // Some entity ids like 10602808 is currently not having label value in english https://www.wikidata.org/w/api.php?action=wbgetentities&ids=Q10602808|Q31&props=labels&languages=en&format=json
                                    if (locationDetails[p.POB.toString()] !== true) {
                                        p.POB = locationDetails[p.POB.toString()];
                                    }
                                }
                                if (p.citizen) {
                                    if (locationDetails[p.citizen.toString()] !== true) {
                                        p.citizen = locationDetails[p.citizen.toString()];
                                    }
                                }
                                if (p.gender) {
                                    switch (p.gender) {
                                        case 6581097:
                                            p.gender = 'Male';
                                            break;
                                        case 6581072:
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
