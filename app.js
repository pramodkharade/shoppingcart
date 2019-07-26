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
const port  = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'public')));
app.use((req,res,next)=>{
    User.findById('5d3abd4b93ef26434e2c87db')
    .then((user)=>{
        req.user = new User(user.name, user.email, user.cart, user._id);
        console.log('user Data is: ',req.user);
        next();
    })
    .catch((error)=>{
        console.log(error);
    });
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