const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const User = require('../models/user.model');
const Token = require('../models/token.model');
const sendEmail = require('../../utils/sendEmail');

class UserController {
  async signup(req, res) {
    try {
      const { email, password } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res
          .status(400)
          .json({ message: 'User with given email already exist!' });
      }

      const hashedPass = await bcrypt.hash(password, 10);

      const newUser = await new User({
        email,
        password: hashedPass,
      }).save();

      const token = await new Token({
        userId: newUser._id,
        token: crypto.randomBytes(32).toString('hex'),
      }).save();

      const message = `${process.env.BASE_URL}/user/verify/${newUser.id}/${token.token}`;
      await sendEmail(newUser, 'Verify', message);

      res.send('An Email sent to your account please verify');
      // res.status(201).json({ message: 'Successful account sign up!' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Account sign up failed!' });
    }
  }
}

module.exports = new UserController();
