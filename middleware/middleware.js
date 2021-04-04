const { StatusCodes, ReasonPhrases } = require('http-status-codes');
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

exports.delete = (req, res, next) => {
  if (req.method === 'DELETE') {
    res.status(StatusCodes.METHOD_NOT_ALLOWED).send(ReasonPhrases.METHOD_NOT_ALLOWED);
  } else {
    next();
  }
};

exports.logs = (req, res, next) => {
  winstonLogger.log({
    level: 'info',
    serverTime: req.serverTime,
    requestType: req.method,
    url: req.url,
    body: req.body,
    query: req.query,
    headers: req.headers,
    dateValidation: req.dateValidation,
  });
  next();
};

exports.error = (err, req, res, _next) => {
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(`${ReasonPhrases.INTERNAL_SERVER_ERROR}: We're sorry, the error was:  ${err.message}`);
};
