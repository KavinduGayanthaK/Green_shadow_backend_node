import { createLogger, transports, transport } from 'winston';

const logger = createLogger({
    transports: new transports.File({filename:'App.log'})
});

export default logger;