var winston = require('winston');

const options = ['simple', 'with_timestamp', 'colorize', 'different_log_files', 'rotate_logs']

const option = process.argv[2];
if (option == 'simple') {
    simple();
} else if (option == 'with_timestamp') {
    with_timestamp();
} else if(option == 'colorize'){
    colorize();
} else if(option == 'differnet-log-files'){

} else if(option == 'rotate-logs'){

}

function simple(){
    const {createLogger, transports} = winston;
    const logger = createLogger({
        transports:[
            new transports.Console(),
            new transports.File({filename:'all.log'})
        ]
    })
    logger.info('log from SIMPLE, this is info');
    logger.error('log from SIMPLE, this is error');
}

function with_timestamp(){
    const {createLogger, transports, format} = winston;
    const logger = createLogger({
        format: format.combine(format.timestamp(),format.json()),
        transports:[
            new transports.Console(),
            new transports.File({filename:'all.log'})
        ]
    })
    logger.info('log from WITH_TIMESTAMP, this is info');
    logger.error('log from WITH_TIMESTAMP, this is error');
}

function colorize(){
    const { red } = require('colors')
    const { createLogger, format, transports } = winston
    const { combine, timestamp, label, printf, colorize } = format
    const myFormat = printf(info => {
        return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`
      })
    
    const logger = createLogger({
      format: combine(
        label({ label: red('My Label') }),
        timestamp()
      ),
      transports: [
        new transports.Console({
          format: combine(
            colorize(),
            myFormat
          ),
          level: 'silly' }),
        new transports.File({ format: myFormat, filename: 'info.log', level: 'info' }),
        new transports.File({ format: myFormat, filename: 'error.log', level: 'error' })
      ]
    })
    logger.info('This is from colorize');
    logger.error('This is from colorize');
    logger.silly('This is silly');
}