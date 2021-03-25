const { StatusCodes, ReasonPhrases } = require('http-status-codes');

module.exports = (req, res, next) => {
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
      req.dateValidation = epochTime;
      req.epochTime = serverTime;
      next();
    } else {
      res.status(StatusCodes.UNAUTHORIZED).send(ReasonPhrases.UNAUTHORIZED);
    }
  } else {
    res.status(StatusCodes.UNAUTHORIZED).send(ReasonPhrases.UNAUTHORIZED);
  }
};
