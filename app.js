const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoConnect = require('./utils/database');

// const adminRouter = require('./routes/admin');
// const shopRoutes = require('./routes/shop');

const app = express();
//app.engine('hbs',expressHbs());
app.set('view engine','ejs');
 //app.set('view engine','pug');
app.set('views','views');
const port  = process.env.PORT || 4000;

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'public')));
app.use((req,res,next)=>{
    // User.findByPk(1)
    // .then((user)=>{
    //     req.user = user;
    //     next();
    // })
    // .catch((error)=>{
    //     console.log(error);
    // });
});
// app.use('/admin',adminRouter.router);
// app.use(shopRoutes);
// app.use((req,res,next)=>{
//     res.status(404).render('404',{pageTitle:'Page Not found',path:'/'})
// });


mongoConnect((client)=>{
    console.log(client);
    app.listen(port,()=>{
        console.log('Server is running on ',port);
    });
});