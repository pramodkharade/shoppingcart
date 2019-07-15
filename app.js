const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./utils/database');
const rootDir = require('./utils/path');
const adminRouter = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const sequelize = require('./utils/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');
const app = express();
//app.engine('hbs',expressHbs());
app.set('view engine','ejs');
 //app.set('view engine','pug');
app.set('views','views');
const port  = process.env.PORT || 4000;
// db.execute('select * from products')
//     .then((result)=>{
//         console.log(result[0]);
//     })
//     .catch((error)=>{
//         console.log(error);
//     });
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'public')));
app.use((req,res,next)=>{
    User.findByPk(1)
    .then((user)=>{
        req.user = user;
        next();
    })
    .catch((error)=>{
        console.log(error);
    });
});
app.use('/admin',adminRouter.router);
app.use(shopRoutes);
app.use((req,res,next)=>{
    //res.status(404).sendFile(path.join(rootDir,'views','404.html'));
    res.status(404).render('404',{pageTitle:'Page Not found',path:'/'})
});
Product.belongsTo(User,{constraints:true,onDelete:'CASCADE'});
User.hasMany(Product);
/****Cart to user 1->1 ***/
User.hasOne(Cart);
Cart.belongsTo(User);
/***Cart to product Many to many M<===>M relationship ***/
Cart.belongsToMany(Product,{through:CartItem});
Product.belongsToMany(Cart,{through:CartItem});

/****Order, order Item and User relationship****/

Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through:OrderItem});

sequelize
//.sync({force:true})
.sync()
    .then((result)=>{
        console.log("Table created successfully");
        return User.findByPk(1);
    })
    .then((user)=>{
        if(!user){
           return  User.create({name:'Pramod',email:'kharade.pramod91@gmail.com'});
        }
        return user;
    })
    .then((user)=>{
        return user.createCart();
    })
    .then((cart)=>{
        console.log('Cart is created:',cart);
    })
    .catch((error)=>{
        console.log('Sync:',error);
    });
app.listen(port,()=>{
    console.log('Server is running on ',port);
});