const User = require('../models/user');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.signup = async (req, res) => {
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
