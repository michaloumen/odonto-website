const User = require('../models/user');

exports.signup = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.json({ user });
  } catch (err) {
    if (err.code === 11000 && err.keyPattern && err.keyValue) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};
