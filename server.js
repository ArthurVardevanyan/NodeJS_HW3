const Express = require('express');
const { StatusCodes } = require('http-status-codes');

const app = Express();
app.use(Express.json());

app.get('/', (req, res) => {
  res.status(StatusCodes.OK).send('Hello World');
});

app.listen(8080);

module.exports = app;
