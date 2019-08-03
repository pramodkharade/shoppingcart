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
exports.getSignup = (req, res, next) => {
    res.render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      isAuthenticated: false
    });
  };
exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const name = req.body.name;
    User.findOne({email:email})
        .then(userDoc=>{
            if(userDoc){
                return res.redirect('/signup');
            }
            const user = new User({
                email:email,
                password:password,
                name:name,
                cart:{items:[]}
            });
            console.log('User is:',user);
            return user.save();
        })
        .then(result=>{
            res.redirect('/login');
        })
        .catch(error=>{
            console.log(error);
        });

};
exports.postlogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
      });
};