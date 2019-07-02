const express = require('express');
const bodyParser = require('body-parser');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const app = express();
const port  = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended:false}));
app.use(adminRoutes);
app.use(shopRoutes);
app.listen(port,()=>{
    console.log('Server is running on ',port);
});