const express = require('express');
const router = express.Router();
const { signup, signin, signout, requireSignin } = require('../controllers/auth');
const { validateName, validateEmail, validatePassword } = require('../validator');

router.post('/signup', [validateName, validateEmail, validatePassword], signup);
router.post('/signin', signin);
router.get('/signout', signout);

// router.get('/hello',requireSignin, (req, res) => {
//   res.send('hello there');
// });

module.exports = router;