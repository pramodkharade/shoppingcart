const express = require('express');
const path = require('path');
const rootDir = require('../utils/path');
const router = express.Router();
console.log('path is:',rootDir);
router.get('/',(req,res,next)=>{
    
    res.sendFile(path.join(__dirname,'../','views','shop.html'));
});

module.exports = router;