const UserModel = require("../models/userModel");
const { oauth2Client } = require("../utills/googleConfig"); 
const jwt = require("jsonwebtoken");
const axios = require("axios");
require("dotenv").config();

const googleLogin = async (req, res) => {
  try {
    const { code } = req.query;

    // ✅ Validate code
    if (!code || typeof code !== "string") {
      return res.status(400).json({ success: false, message: "Authorization code is required" });
    }

    // ✅ Exchange code for tokens
    const { tokens } = await oauth2Client.getToken({
      code,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI, // make sure this is set in .env and Google Console
    });
    oauth2Client.setCredentials(tokens);

    // ✅ Get user info from Google
    const { data } = await axios.get("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });

    const { id, email, name, picture } = data;

    if (!email || !id) {
      return res.status(400).json({
        success: false,
        message: "Failed to retrieve user info from Google",
      });
    }

    // ✅ Find or create user in DB
    let user = await UserModel.findOne({ googleId: id });
    if (!user) {
      user = await UserModel.create({
        googleId: id,
        name,
        email,
        image: picture,
      });
    }

    // ✅ Create JWT token
    const payload = { _id: user._id, email };
    const jwtToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_TIMEOUT || "1h",
    });

    // ✅ Send JWT as HttpOnly cookie + safe user info in JSON
    res
      .cookie("auth_token", jwtToken, {
        httpOnly: true,         // 🔐 JS can't access
        secure: true,           // 🔐 HTTPS only
        sameSite: "None",     // 🔐 protect against CSRF
        maxAge: 12 * 60 * 60 * 1000, // ⏱️ 12 hours
      })
      .status(200)
      .json({
        success: true,
        message: "Login successful",
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          image: user.image,
        },
      });

  } catch (error) {
    console.error("Error during Google login:", error?.response?.data || error.message);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
const getCurrentUser = async (req, res) => {
  try {
    const token = req.cookies.auth_token;
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserModel.findById(decoded._id).select('-__v -googleId');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ user });
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};
const logout = (req, res) => {
  res.clearCookie('auth_token', {
    httpOnly: true,
    secure: true,
    sameSite: 'Strict',
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

module.exports = {
  googleLogin,
  getCurrentUser,
  logout,
};
