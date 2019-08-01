const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');

router.get('/login',authController.getlogin);
router.post('/login',authController.postlogin);
module.exports = router;