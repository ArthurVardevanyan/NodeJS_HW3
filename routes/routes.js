const Express = require('express');

const router = Express.Router();

const Controller = require('../controllers/controller');

router.all('/', Controller.random);

module.exports = router;
