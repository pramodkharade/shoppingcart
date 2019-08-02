const User = require('../models/user');
exports.getlogin = (req, res, next) => {
    //const isLoggedIn = req.get('Cookie').split('=')[1].trim()==='true';
    
    //console.log('Cookie is:', isLoggedIn);
    res.render('auth/login', {
        path: "/login",
        pageTitle: 'Login',
        isAuthenticated: false
    });
};

exports.postlogin = (req, res, next) => {
    User.findById('5d43e9bce57b8c22a009ee41')
    .then(user => {
      req.session.isLoggedIn = true;
      req.session.user = user;
      req.session.save((error)=>{
          res.redirect('/');
      });
    })
    .catch(err => console.log(err));
};

exports.postlogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
      });
};