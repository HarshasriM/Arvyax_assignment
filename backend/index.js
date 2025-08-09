require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const authRoutes = require('./routes/auth.js');
const sessionsRoutes = require('./routes/session.js');

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

app.use('/api/auth', authRoutes);
app.use('/api/sessions', sessionsRoutes);

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Mongo connected');
    const port = process.env.PORT || 5000;
    app.listen(port, () => console.log('Server running on', port));
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
start();
