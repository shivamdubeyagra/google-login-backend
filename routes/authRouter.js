const { googleLogin, getCurrentUser, logout } = require('../controllers/authController');

const router = require('express').Router();

router.post('/google', googleLogin);
router.get('/me', getCurrentUser);
router.post('/logout',logout );

module.exports = router;

// In index.js, import and use the authRouter
