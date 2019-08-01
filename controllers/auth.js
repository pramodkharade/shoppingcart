exports.getlogin = (req, res, next) => {
    res.render('auth/login', {
        path: "/login",
        pageTitle: 'Login',
        isAuthenticated: req.isLoggedIn
    });
};

exports.postlogin = (req, res, next) => {
    req.isLoggedIn = true;
    res.redirect('/');
};