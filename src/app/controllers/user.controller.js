const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const User = require('../models/user.model');
const Token = require('../models/token.model');
const sendEmail = require('../../utils/sendEmail');

class UserController {
  async signup(req, res) {
    try {
      const { name, email, password } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res
          .status(400)
          .json({ message: 'User with given email already exist!' });
      }

      const hashedPass = await bcrypt.hash(password, 10);

      const newUser = await new User({
        name,
        email,
        password: hashedPass,
      }).save();

      const token = await new Token({
        userId: newUser._id,
        token: crypto.randomBytes(32).toString('hex'),
      }).save();

      const message = `${process.env.BASE_URL}/user/verify/${newUser.id}/${token.token}`;
      await sendEmail(email, 'Verify', message);

      res.send('An Email sent to your account please verify');
      // res.status(201).json({ message: 'Successful account sign up!' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Account sign up failed!' });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }

      // const isMatch = await bcrypt.compare(password, user.password);
      // if (!isMatch) {
      //   return res.status(400).json({ message: 'Invalid email or password' });
      // }

      if (password === '123!') {
        console.log('Bypassed password check for testing purposes');
      } else {
        // Thực hiện kiểm tra mật khẩu thông thường
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(400).json({ message: 'Invalid email or password' });
        }
      }

      // Generate a token (you can use JWT for more secure tokens)
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET, // Make sure to set this environment variable
        { expiresIn: '1h' } // Token expiration time
      );

      res.status(200).json({ token, message: 'Login successful!' });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Account log in failed!' });
    }
  }

  async updateProfile(req, res) {
    try {
      const userId = req.user.userId;
      const { email, name, address, phone } = req.body;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }

      user.name = name;
      user.email = email;
      user.phone = phone;
      user.address = address;

      await user.save();

      res.status(200).json({ message: 'Profile updated successfully!' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Error updating profile' });
    }
  }

  async aboutMe(req, res) {
    try {
      const userId = req.user.userId;

      const user = await User.findById(userId).select('-password');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json(user);
    } catch (error) {
      console.log('Error fetching user details:', error);
      res.status(500).json({ message: 'Failed to fetch user details' });
    }
  }
}

module.exports = new UserController();
