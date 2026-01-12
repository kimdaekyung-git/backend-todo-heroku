const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// POST /api/users/register - 회원가입
router.post('/register', userController.registerUser);

// POST /api/users/login - 로그인
router.post('/login', userController.loginUser);

module.exports = router;
