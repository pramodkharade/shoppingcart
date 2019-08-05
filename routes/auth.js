const express = require('express');
const { check } = require('express-validator/check');
const router = express.Router();
const authController = require('../controllers/auth');

router.get('/login',authController.getlogin);
router.post('/login',authController.postlogin);
router.get('/signup', authController.getSignup);
router.get('/reset', authController.getReset);
router.post('/reset', authController.postReset);
router.post('/signup', check('email').isEmail(), authController.postSignup);
router.post('/logout',authController.postlogout);
router.get('/reset/:token',authController.getNewPassword);
router.post('/new-password',authController.postNewPassword);
module.exports = router;