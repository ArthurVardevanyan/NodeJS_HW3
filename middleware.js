const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const winstonLogger = require('./winstonLogger');

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
    serverTime: req.epochTime,
    requestType: req.method,
    url: req.url,
    body: req.body,
    query: req.query,
    headers: req.headers,
    dateValidation: req.dateValidation,
  });
  next();
};

exports.error = (err, req, res, next) => {
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(`We're sorry, the error was: ${ReasonPhrases.INTERNAL_SERVER_ERROR}`);
};
