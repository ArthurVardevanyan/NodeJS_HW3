const Express = require('express');

const app = Express();

const DateValidation = require('./middleware/middleware.dateValidation');
const Middleware = require('./middleware/middleware');
const Routes = require('./routes/routes');

app.use(Express.json());
app.use(Middleware.delete);
app.use(DateValidation);
app.use(Middleware.logs);
app.use('/', Routes);
app.use(Middleware.error);

app.listen(8080);

module.exports = app;
