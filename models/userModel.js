const mongoose = require('mongoose');
 
const UserSchema = new mongoose.Schema({
    googleId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

const UserModel = mongoose.model('social-login', UserSchema);

module.exports = UserModel;