const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
router.get('/login',authController.getlogin);
module.exports = router;