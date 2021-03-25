const Express = require('express');

const router = Express.Router();

const Controller = require('./controller');

router.use('/', Controller.random);

module.exports = router;
