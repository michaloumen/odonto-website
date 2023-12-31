const User = require('../models/user');
const { errorHandler } = require('../helpers/dbErrorHandler');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

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

exports.signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        err: 'User with that email does not exist. Please signup'
      });
    }

    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: 'Email and password dont match'
      });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    res.cookie('token', token, { expire: new Date() + 9999 });
    const { _id, name, role } = user;
    return res.json({ token, user: { _id, email, name, role } });
  } catch (err) {
    return res.status(500).json({
      err: 'Internal server error'
    });
  }
};

exports.signout = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Signout success' });
};

exports.requireSignin = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    req.auth = decoded;
    next();
  });
};

exports.isAuth = (req, res, next) => {
  let user = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!user) {
    return res.status(403).json({
      error: 'Access denied'
    });
  };
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(403).json ({
      error: 'Admin resourse! Access denied'
    });
  };
  next();
};