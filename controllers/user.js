const User = require('../models/user');
const { errorHandler } = require('../helpers/dbErrorHandler');
const { validationResult } = require('express-validator');

exports.signup = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let user = new User(req.body);
  try {
    user = await user.save();
    user.salt = undefined;
    user.hashed_password = undefined;
    res.json({ user });
  } catch (err) {
    res.status(400).json({
      err: errorHandler(err)
    });
  }
};
