const express = require('express');
const router = express.Router();
const { signup, signin } = require('../controllers/user');
const { validateName, validateEmail, validatePassword } = require('../validator');

router.post('/signup', [validateName, validateEmail, validatePassword], signup);
router.post('/signin', signin);

module.exports = router;