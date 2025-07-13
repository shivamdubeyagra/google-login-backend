const mongoose = require('mongoose');
 require('dotenv').config();

const DB_URI = process.env.DB_URI;


const connectDB = async () => {
    try {
        await mongoose.connect(DB_URI);
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1);
    }
};

module.exports = connectDB;

// In index.js, import and use connectDB