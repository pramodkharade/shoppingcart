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
    req.session.isLoggedIn = true;
    res.redirect('/');
};