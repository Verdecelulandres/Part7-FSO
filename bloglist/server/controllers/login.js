const loginRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body;
  const user = await User.findOne({ username });
  const isCorrectPwd = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash);
  if (!(user && isCorrectPwd)) {
    return response.status(401).json({ error: 'Invalid credentials' });
  }

  const tokenUser = {
    username: user.username,
    id: user._id
  }
  const token = jwt.sign(tokenUser, process.env.SECRET, { expiresIn: 60 * 60 });

  response.status(200).send({ token, username: user.username, name: user.name });
});

module.exports = loginRouter;