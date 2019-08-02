const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const mongodbStore = require('connect-mongodb-session')(session);

const adminRouter = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const User = require('./models/user');
const MONGOURI ='mongodb://127.0.0.1:27017/shoppingCart';
const app = express();
const store = new mongodbStore({
    uri: MONGOURI,
    collection:'sessions'
});
//app.engine('hbs',expressHbs());
app.set('view engine', 'ejs');
//app.set('view engine','pug');
app.set('views', 'views');
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret:'thisisthenodeapplication',
     resave:false,
     saveUninitialized:false,
    store:store
    }));
app.use((req, res, next) => {
    if(!req.session.user._id){
       return  next();
    }
    User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));  
});
app.use('/admin', adminRouter.router);
app.use(shopRoutes);
app.use(authRoutes);
app.use((req, res, next) => {
    res.status(404).render('404', { pageTitle: 'Page Not found', path: '/' })
});

mongoose.connect(MONGOURI, { useNewUrlParser: true })
    .then((result) => {
        User.findOne().then(user => {
            if (!user) {
                const user = new User({
                    name: 'Pramod Kharade',
                    email: 'kharade.pramod91@gmail.com',
                    cart: {
                        items: []
                    }
                });
                user.save();
            }
        });

        app.listen(port, () => {
            console.log('Server is running on mongoose ', port);
        });
    })
    .catch(error => {
        console.log('connection error is: ', error);
    });