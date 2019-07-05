const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const rootDir = require('./utils/path');
const adminRouter = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const app = express();
//app.engine('hbs',expressHbs());
app.set('view engine','ejs');
 //app.set('view engine','pug');
app.set('views','views');
const port  = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'public')));
app.use('/admin',adminRouter.router);
app.use(shopRoutes);
app.use((req,res,next)=>{
    //res.status(404).sendFile(path.join(rootDir,'views','404.html'));
    res.status(404).render('404',{pageTitle:'Page Not found',path:'/'})
});
app.listen(port,()=>{
    console.log('Server is running on ',port);
});