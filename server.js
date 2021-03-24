const Express = require('express');

const app = Express();
app.use(Express.json());

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(8080);

module.exports = app;
