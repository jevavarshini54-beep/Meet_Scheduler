const express = require('express');
const router = express.Router();
const authMiddleware = require('../ProtectedRoutes/authMiddleware');

const {signup, login, logout} = require('../Controllers/AuthControllers');

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', authMiddleware, logout);

module.exports = router;