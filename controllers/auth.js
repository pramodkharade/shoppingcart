exports.getlogin = (req, res, next) => {
    const isLoggedIn = req.get('Cookie').split('=')[1].trim()==='true';
    
    console.log('Cookie is:', isLoggedIn);
    res.render('auth/login', {
        path: "/login",
        pageTitle: 'Login',
        isAuthenticated: isLoggedIn
    });
};

exports.postlogin = (req, res, next) => {
    res.setHeader('Set-Cookie','isLoggedIn=true; Max-age=10');
    res.redirect('/');
};