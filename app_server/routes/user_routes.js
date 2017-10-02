'use strict';

const router = require('express').Router();
const userController = require('../controllers/user_controller.js');

router.post('/register', userController.register);

router.post('/login', userController.login);

router.get('/profile', userController.isAuth, userController.getProfile);

module.exports = router;