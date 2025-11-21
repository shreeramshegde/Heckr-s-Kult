const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getProfile,
  registerValidation,
  loginValidation
} = require('../controllers/authController');
const { auth } = require('../middleware/auth');

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/profile', auth, getProfile);

module.exports = router;
