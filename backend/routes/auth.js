const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');

if (!process.env.TOKEN_SECRET) {
  console.error("TOKEN_SECRET is not set.");
  process.exit(1);
}

// Validation rules for the registration endpoint
const registerValidation = [
  check('email', 'Valid email is required').isEmail(),
  check('password', 'Password with 6 or more characters is required').isLength({ min: 6 })
];

// User registration with validation
router.post('/register', registerValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Destructure required fields from req.body
    const {username, email, password} = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use. Please try other" });
    }

    // Create a new user with the hashed password and username
    const newUser = new User({
      username,
      email, // Ensure username is included
      password,
    });

    const savedUser = await newUser.save();
    res.status(201).json({ message: "User registered successfully", userId: savedUser._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An unexpected error occurred." });
  }
});


// User login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare the provided password with the hashed password in the database
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // Create and assign a token
    const token = jwt.sign(
      { _id: user._id, username: user.username },
      process.env.TOKEN_SECRET,
      { expiresIn: '1h' }
    );

    res.header('Authorization', 'Bearer ' + token).json({
      message: "Login successful",
      token,
      username: user.username
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An unexpected error occurred." });
  }
});

module.exports = router;
