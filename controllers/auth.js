exports.getlogin = (req, res, next) => {
    const isLoggedIn = req.get('Cookie').split('=')[1].trim();
    res.render('auth/login', {
        path: "/login",
        pageTitle: 'Login',
        isAuthenticated: isLoggedIn
    });
};

exports.postlogin = (req, res, next) => {
    res.setHeader('Set-Cookie','isLoggedIn=true');
    res.redirect('/');
};