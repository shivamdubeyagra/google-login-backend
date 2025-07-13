require('dotenv').config();
const {google} = require('googleapis');
const OAuth2 = google.auth.OAuth2;

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    throw new Error('Google Client ID and Secret must be set in environment variables');
}
const oauth2Client = new OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI 
);

module.exports = { oauth2Client };