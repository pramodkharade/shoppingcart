const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

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
// app.use((req,res,next)=>{
//     User.findById('5d3abd4b93ef26434e2c87db')
//     .then((user)=>{
//         req.user = new User(user.name, user.email, user.cart, user._id);
//         console.log('user Data is: ',req.user);
//         next();
//     })
//     .catch((error)=>{
//         console.log(error);
//     });
// });
app.use('/admin',adminRouter.router);
app.use(shopRoutes);
app.use((req,res,next)=>{
    res.status(404).render('404',{pageTitle:'Page Not found',path:'/'})
});

mongoose.connect('mongodb://127.0.0.1:27017/shoppingCart',{ useNewUrlParser:true})
.then((result)=>{
    const user = new User({
        name:'Pramod Kharade',
        email:'kharade.pramod91@gmail.com',
        cart:{
            items:[]
        }
    });
    user.save();
    app.listen(port,()=>{
        console.log('Server is running on mongoose ',port);
    });
})
.catch(error=>{
    console.log('connection error is: ',error);
});