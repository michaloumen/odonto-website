const express = require('express');
const router = express.Router();
const { signup } = require('../controllers/user');
const { validateName, validateEmail, validatePassword } = require('../validator');

router.post('/signup', [validateName, validateEmail, validatePassword], signup);

module.exports = router;