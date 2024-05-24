const User = require('../models/user.model');

class UserController {
  async signup(req, res) {
    try {
      const { email, password } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email da ton tai' });
      }

      const newUser = new User({
        email,
        password,
      });

      await newUser.save();
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Dang ky that bai' });
    }
  }
}
