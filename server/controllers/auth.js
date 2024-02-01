const User = require('../model/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

exports.register = async (req, res, next) => {
  try {
    console.log('Request Body:', req.body);

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: hash,
    });

    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};


exports.login = async (req, res, next) => {
  try {
    console.log('Login Request Body:', req.body);

    const user = await User.findOne({ name: req.body.name });

    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!isPasswordCorrect) {
      console.log('Incorrect password');
      return res.status(401).json({ message: 'Incorrect password' });
    }

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      'ILOVEANNA',
      { expiresIn: '1h' }
    );
    

    const { password, isAdmin, ...otherDetails } = user._doc;
    res
      .cookie('access_token', token, {
        httpOnly: true,
      })
      .status(200)
      .json({
        details: { ...otherDetails, token },
        isAdmin,
      });
  } catch (err) {
    next(err);
  }
};



exports.logout = (req, res, next) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
        return res.status(500).json({ status: 'error', error: 'Internal Server Error' });
      }
  
      res.status(200).json({ status: 'success' });
    });
  };



  