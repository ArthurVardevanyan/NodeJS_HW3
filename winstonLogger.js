const Winston = require('winston');

const winstonLogger = Winston.createLogger({
  transports: [
    new Winston.transports.Console({
      format: Winston.format.combine(
        Winston.format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
        }),
        Winston.format.json(),
      ),
    }),
  ],
});

module.exports = winstonLogger;
