const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const User = require('../models/user');

    const transporter = nodemailer.createTransport(
        sendgridTransport({
          auth: {
            api_key:
            'your sendgrid key'
          }
        })
      );
exports.getlogin = (req, res, next) => {
  //const isLoggedIn = req.get('Cookie').split('=')[1].trim()==='true';

  //console.log('Cookie is:', isLoggedIn);
    let message = req.flash('error');
    if(message.length > 0){
        message = message[0];
    }else{
        message = null;
    }
  res.render('auth/login', {
    path: "/login",
    pageTitle: 'Login',
    isAuthenticated: false,
    csrfToken: req.csrfToken(),
    errorMessage: message
  });
};

exports.postlogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({
    email: email,
    
  })
    .then(user => {
        if(!user){
            req.flash('error','invalid email or password.');
            return res.redirect('/login');
        }
      return bcrypt.compare(password, user.password)
        .then((doMatch) => {
            if(!doMatch){
                req.flash('error','invalid email or password.');
                return res.redirect('/login');
            }
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save((error) => {
              res.redirect('/');
            });
          }
          res.redirect('/login');
        })
        .catch(error => {
          console.log(error);
        });

    })
    .catch(err => console.log(err));
};
exports.getSignup = (req, res, next) => {
    let message = req.flash('error');
    if(message.length > 0){
        message = message[0];
    }else{
        message = null;
    }
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    isAuthenticated: false,
    errorMessage: message
  });
};
exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const name = req.body.name;
  User.findOne({
    email: email
  })
    .then(userDoc => {
      if (userDoc) {
        req.flash('error','E-mail already exists. Please pick different one');
        return res.redirect('/signup');
      }
      return bcrypt.hash(password, 12)
        .then(hasspassword => {
          const user = new User({
            email: email,
            password: hasspassword,
            name: name,
            cart: {
              items: []
            }
          });
          console.log('User is:', user);
          return user.save();
        })
        .then(result => {
            res.redirect('/login');
            return transporter.sendMail({
                to: email,
                from: 'shoppoingCart@itdesire.com',
                subject: 'Signup succeeded!',
                html: '<h1>You successfully signed up!</h1>'
              });
        }).catch(error=>{
            console.log(error);
        });

    })

    .catch(error => {
      console.log(error);
    });

};
exports.postlogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};

exports.getReset = (req,res,next)=>{
    let message = req.flash('error');
    if(message.length > 0){
        message = message[0];
    }else{
        message = null;
    }
    res.render('auth/reset', {
        path: "/reset",
        pageTitle: 'Reset Password',
        isAuthenticated: false,
        csrfToken: req.csrfToken(),
        errorMessage: message
      });
};
exports.postReset = (req,res,next)=>{
    const email = req.body.email;
    crypto.randomBytes(32,(err,buffer)=>{
        if(err){
            console.log(err);
           return res.redirect('/reset');
        }
        const token =buffer.toString('hex');
        User.findOne({
            email: email,
            
          })
            .then(user=>{
                if(!user){
                    req.flash('error','No account found with this '+email);
                    return res.redirect('/reset');
                }
                user.resetToken = token;
                user.resetTokenExpiration =  Date.now() + 3600000;
                return user.save();
                
            })
            .then(result=>{
                res.redirect('/');
                transporter.sendMail({
                    to: req.body.email,
                    from: 'shoppoingCart@itdesire.com',
                    subject: 'Reset Password!',
                    html: `<p> You have requested to a reset password.</p>
                           <p>Click this <a href='http://localhost:3000/reset/${token}'>link</a> to set a new password.</p>
                    `

                  });
            })
            .catch(error=>{
                console.log(error);
            });
    });
};