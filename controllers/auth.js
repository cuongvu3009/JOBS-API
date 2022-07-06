const User = require('../models/User');
const { BadRequestError, UnauthenticatedError } = require('../errors');

const login = async (req, res) => {
  const { email, password } = req.body;
  //	find one if user exist (email)
  if (!email || !password) {
    throw new BadRequestError('Please provide email and password');
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new UnauthenticatedError('User not found!');
  }
  //	compare password
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Invalid Credentials!');
  }
  //	return token
  const token = await user.createJWT();
  res.status(200).json({ user: { user: user.name }, token });
};

const register = async (req, res) => {
  const user = await User.create({ ...req.body });
  const token = await user.createJWT();
  res.status(201).json({ user: { name: user.name }, token });
};

module.exports = { login, register };
