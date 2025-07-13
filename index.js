const express = require('express');
const authRouter = require('./routes/authRouter');
const cookieParser = require('cookie-parser');
const connectDB = require('./models/dbConnection');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN ,
  credentials: true,
}));
app.use(cookieParser());

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the Google Login Backend!');
});
app.use('/auth', authRouter);

// Start server
app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on http://localhost:${PORT}`);
});
