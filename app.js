const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoConnect = require('./utils/database').mongoConnect;

const adminRouter = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const User = require('./models/user');

const app = express();
//app.engine('hbs',expressHbs());
app.set('view engine','ejs');
 //app.set('view engine','pug');
app.set('views','views');
const port  = process.env.PORT || 4000;

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'public')));
app.use((req,res,next)=>{
    User.findById('5d2ec09aaa2efb2689255858')
    .then((user)=>{
        req.user = user;
        next();
    })
    .catch((error)=>{
        console.log(error);
    });
    next();
});
app.use('/admin',adminRouter.router);
app.use(shopRoutes);
app.use((req,res,next)=>{
    res.status(404).render('404',{pageTitle:'Page Not found',path:'/'})
});


mongoConnect(()=>{
    app.listen(port,()=>{
        console.log('Server is running on ',port);
    });
});