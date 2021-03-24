const Express = require('express');
const Winston = require('winston');
const { StatusCodes, ReasonPhrases } = require('http-status-codes');

const app = Express();
app.use(Express.json());

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

app.delete('/', (req, res) => {
  res.status(StatusCodes.METHOD_NOT_ALLOWED).send(ReasonPhrases.METHOD_NOT_ALLOWED);
});

app.get('/', (req, res, next) => {
  next();
});

app.use('/', (req, res, next) => {
  winstonLogger.log({
    level: 'info',
    epochTime: Math.floor(Date.now() / 1000),
    requestType: req.method,
    url: req.url,
    body: req.body,
    query: req.query,
    headers: req.headers,
    dateValidation: 'Function Not Created Yet',
  });
  next();
});

app.use('/', (req, res) => {
  const random = Math.round(Math.random());
  if (random === 1) {
    res.status(StatusCodes.OK).send('Hello World');
  } else {
    throw new Error('50% Failure');
  }
});

app.use((err, req, res, next) => {
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(ReasonPhrases.INTERNAL_SERVER_ERROR);
});

app.listen(8080);

module.exports = app;
