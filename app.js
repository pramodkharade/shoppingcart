const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const mongodbStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');
const adminRouter = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const shopController = require('./controllers/shop');
const isAuth = require('./middleware/is-auth');
const User = require('./models/user');

const MONGOURI ='mongodb://127.0.0.1:27017/shoppingCart';
const app = express();
const store = new mongodbStore({
    uri: MONGOURI,
    collection:'sessions'
});
const csrfProcection = csrf();
//app.engine('hbs',expressHbs());
app.set('view engine', 'ejs');
//app.set('view engine','pug');
app.set('views', 'views');
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
const fileStorage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'images');
    },
    filename:(req,file,cb)=>{
        cb(null,new Date().getTime()+file.originalname);
    }
});
const fileFilter = (req,file,cb)=>{
    if(file.mimetype==='image/png' || file.mimetype==='image/jpg' || file.mimetype==='image/jpeg'){
        cb(null,true);
    }else{
        cb(null,false);
    }
};
app.use(multer({storage: fileStorage, fileFilter:fileFilter}).single('image'));
app.use(express.static(path.join(__dirname, 'public')));
app.use("/images",express.static(path.join(__dirname, 'images')));
app.use(session({
    secret:'thisisthenodeapplication',
     resave:false,
     saveUninitialized:false,
    store:store
    }));
    app.use((req, res, next) => {
        if(!req.session.user){
            return  next();
        }
        User.findById(req.session.user._id)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err));  
    });
    app.post('/create-order', isAuth, shopController.postOrder);
app.use(csrfProcection);
app.use((req,res,next)=>{
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});
app.use(flash());
app.use('/admin', adminRouter.router);
app.use(shopRoutes);
app.use(authRoutes);
app.use((req, res, next) => {
    res.status(404).render('404', { pageTitle: 'Page Not found', path: '/' })
});

mongoose.connect(MONGOURI, { useNewUrlParser: true })
    .then((result) => {
        app.listen(port, () => {
            console.log('Server is running on mongoose ', port);
        });
    })
    .catch(error => {
        console.log('connection error is: ', error);
    });