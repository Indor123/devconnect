require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));

app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/plain');
  res.status(200).send('✅ DevConnect API is running from Termux!');
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas');
    app.listen(8080, '0.0.0.0', () => {
      console.log('🚀 Server running at http://127.0.0.1:8080');
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
  });
