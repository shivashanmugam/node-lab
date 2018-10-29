const operations = require('./operations.js');
const op = process.argv[2];

if (op == 'import_json_data_to_collection') {

    operations.importJSONDataToCollection('import_json_data_to_collection');
    
} else if (op == 'migration_from_one_db_collection_to_another_db_collection') {

    operations.migrationFromOneDbCollectionToAnotherDbDollection('migration_from_one_db_collection_to_another_db_collection')
    
}




