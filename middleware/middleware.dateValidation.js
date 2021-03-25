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
