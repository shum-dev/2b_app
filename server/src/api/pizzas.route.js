const { Router } = require('express');
const PizzasCtrl = require('./pizzas.controller');
const { loginRequired } = require('../middleware/auth');

const router = new Router();

router.get('/', loginRequired, PizzasCtrl.apiGetPizzas);
router.post('/', loginRequired, PizzasCtrl.apiPostPizza);
router.get('/components', loginRequired, PizzasCtrl.apiGetComponents);

module.exports = router;
