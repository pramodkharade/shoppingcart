exports.getlogin = (req, res, next) => {
            res.render('auth/login', {
                path: "/login",
                pageTitle: 'Login',
                
            });
        

};