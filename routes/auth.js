const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');

router.get('/login',authController.getlogin);
router.post('/login',authController.postlogin);
router.get('/signup', authController.getSignup);
router.get('/reset', authController.getReset);
router.post('/signup', authController.postSignup);
router.post('/logout',authController.postlogout);
module.exports = router;