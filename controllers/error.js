exports.get404 = (req,res,next)=>{
    //res.status(404).sendFile(path.join(rootDir,'views','404.html'));
    res.status(404).render('404',{pageTitle:'Page Not found',path:'/404',isAuthenticated: req.session.isLoggedIn})
};