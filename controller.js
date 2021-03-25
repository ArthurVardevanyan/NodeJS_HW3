const { StatusCodes } = require('http-status-codes');

exports.random = (req, res) => {
  const random = Math.round(Math.random());
  if (random === 1) {
    res.status(StatusCodes.OK).send('Hello World');
  } else {
    throw new Error('50% Failure');
  }
};
