const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secret_dev_key';

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check existing user
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already used' });

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, password: hashed });
    res.status(201).json({ message: 'User registered successfully' });

  } catch (err) {
    res.status(500).json({ error: 'Registration failed' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token });

  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
};
