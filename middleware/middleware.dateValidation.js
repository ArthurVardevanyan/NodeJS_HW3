const { StatusCodes, ReasonPhrases } = require('http-status-codes');

function headerSearch(datesToValidate, dateValidation) {
  Object.keys(dateValidation).forEach((key) => {
    if (key.toLowerCase() === 'date-validation') {
      const dates = dateValidation[key].split(', ');
      dates.forEach((date) => {
        datesToValidate.push(date);
      });
    }
  });
}

module.exports = (req, res, next) => {
  const datesToValidate = [];
  const epochsToValidate = [];

  headerSearch(datesToValidate, req.headers);
  headerSearch(datesToValidate, req.query);

  datesToValidate.forEach((d) => {
    const date = Number.parseInt(d, 10);
    if (!Number.isNaN(date)) {
      epochsToValidate.push(date);
    }
  });

  if (epochsToValidate.every((val, i, arr) => val === arr[0])) {
    const serverTime = Math.floor(Date.now() / 1000);
    const requestTime = epochsToValidate.slice(0)[0];
    if (requestTime > (serverTime - (5 * 60))
      && requestTime < (serverTime + (5 * 60))) {
      req.dateValidation = requestTime;
      req.serverTime = serverTime;
      next();
    } else {
      res.status(StatusCodes.UNAUTHORIZED).send(ReasonPhrases.UNAUTHORIZED);
    }
  } else {
    res.status(StatusCodes.UNAUTHORIZED).send(ReasonPhrases.UNAUTHORIZED);
  }
};
