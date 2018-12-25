module.exports = {
    'operation': {
        'upload_image': {
            'environment_variables' : {
                GOOGLE_APPLICATION_CREDENTIALS : `${__dirname}/[[FILE NAME]].json`
            },
            'local_file_path' : '',// image to upload
            'bucket_name' : '',
            'upload_options' : {
                gzip: true,
                predefinedAcl : "publicRead",
                destination : 'images/persons/1919/karthi_kannan.jpeg',
                metadata: {
                  cacheControl: 'public, max-age=432000', //5day cache
                },
            }
        },
        'upload_images_through_folder' : {
            'environment_variables' : {
                GOOGLE_APPLICATION_CREDENTIALS : `${__dirname}/[[FILE NAME]].json`
            },
            'year' : 1918,
            'target_base_path'  : 'images/persons/',
            'local_base_path' : './images/scrapped/',// image to upload
            'bucket_name' : '',
            'upload_options_base' : {
                gzip: true,
                predefinedAcl : "publicRead",
                destination : '',
                metadata: {
                  cacheControl: 'public, max-age=432000', //5day cache
                },
            },
            'concurrent_upload_limit' : 50,
        }
    },
    
}
