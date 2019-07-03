const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const rootDir = require('./utils/path');
const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const app = express();
const port  = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'public')));
app.use('/admin',adminData.router);
app.use(shopRoutes);
app.use((req,res,next)=>{
    res.status(404).sendFile(path.join(rootDir,'views','404.html'));
});
app.listen(port,()=>{
    console.log('Server is running on ',port);
});