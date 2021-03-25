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

app.use('/', (req, res, next) => {
  const datesToValidate = [];
  const epochsToValidate = [];
  Object.keys(req.headers).forEach((key) => {
    if (key.toLowerCase() === 'date-validation') {
      const dates = req.headers[key].split(', ');
      dates.forEach((date) => {
        datesToValidate.push(date);
      });
    }
  });
  Object.keys(req.query).forEach((key) => {
    if (key.toLowerCase() === 'date-validation') {
      const dates = req.query[key].split(', ');
      dates.forEach((date) => {
        datesToValidate.push(date);
      });
    }
  });

  datesToValidate.forEach((d) => {
    let date = Number.parseInt(d, 10);
    if (Number.isNaN(date)) {
      date = (new Date(date)).getTime() / 1000;
    }
    epochsToValidate.push(date);
  });

  if (epochsToValidate.every((val, i, arr) => val === arr[0])) {
    const serverTime = Math.floor(Date.now() / 1000);
    const epochTime = epochsToValidate.slice(0)[0];
    if (epochTime > (serverTime - (5 * 60))
    && epochTime < (serverTime + (5 * 60))) {
      // req.dateValidation = epochTime;
      // req.epochTime = serverTime;
      next();
    } else {
      res.status(StatusCodes.UNAUTHORIZED).send(ReasonPhrases.UNAUTHORIZED);
    }
  } else {
    res.status(StatusCodes.UNAUTHORIZED).send(ReasonPhrases.UNAUTHORIZED);
  }
});

app.use('/', (req, res, next) => {
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
