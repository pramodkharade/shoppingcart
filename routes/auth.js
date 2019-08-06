const express = require('express');
const { check,body } = require('express-validator');
const router = express.Router();
const authController = require('../controllers/auth');

router.get('/login',authController.getlogin);
router.post('/login',authController.postlogin);
router.get('/signup', authController.getSignup);
router.get('/reset', authController.getReset);
router.post('/reset', authController.postReset);
router.post('/signup', 
   [ check('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .custom((value,{req})=>{
        if(value==='test@test.com'){
            throw Error('This email is forbidden.')
        }
        return true;
    }),
    body('password',
         'Please enter a password with number with text and atleast 5 lenght'
         )
    .isLength({ min: 5 })
    .isAlphanumeric()
],
     authController.postSignup);
router.post('/logout',authController.postlogout);
router.get('/reset/:token',authController.getNewPassword);
router.post('/new-password',authController.postNewPassword);
module.exports = router;