const express = require('express');
const path = require('path');
const rootDir = require('../utils/path');
const adminData = require('./admin');
const router = express.Router();

router.get('/',(req,res,next)=>{
    console.log('Shopping: route:',adminData.products);
    res.sendFile(path.join(__dirname,'../','views','shop.html'));
});

module.exports = router;