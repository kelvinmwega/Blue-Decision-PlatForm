import config from '../config';
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;
 
const loggerFormat = printf((info : any) => {
    return `${info.timestamp} | ${info.level}: ${info.message}`;
});
 
const logger = createLogger({
    level: config.loggerLevel,
    format: combine(
        format.colorize(),
        timestamp(),
        loggerFormat
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'error.log', level: 'error' }),
        new transports.File({ filename: 'info.log' })
    ]
    });

export = logger;