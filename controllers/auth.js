const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const User = require('../models/user');
const {validationResult } = require('express-validator');

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: 'Your sendGrid key'
    }
  })
);
exports.getlogin = (req, res, next) => {
  //const isLoggedIn = req.get('Cookie').split('=')[1].trim()==='true';

  //console.log('Cookie is:', isLoggedIn);
  let msg = req.flash('error');
  if (msg.length > 0) {
    msg = msg[0];
  } else {
    msg = null;
  }
  res.render('auth/login', {
    path: "/login",
    pageTitle: 'Login',
    isAuthenticated: false,
    csrfToken: req.csrfToken(),
    errorMessage: msg,
    oldInputs:{
      email:'',
      password:''
    },
    validationErrors:[]
  });
};

exports.postlogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
      errorMessage: errors.array()[0].msg,
      oldInputs:{
        email:email,
        password:password
      },
      validationErrors: errors.array()
    });
  }
  User.findOne({
    email: email,

  })
    .then(user => {
      if (!user) {
        return  res.status(422).render('auth/login', {
          path: "/login",
          pageTitle: 'Login',
          isAuthenticated: false,
          csrfToken: req.csrfToken(),
          errorMessage: 'invalid email or password',
          oldInputs:{
            email:'',
            password:''
          },
          validationErrors:[]
        });
      }
      return bcrypt.compare(password, user.password)
        .then((doMatch) => {
          if (!doMatch) {
           return  res.status(422).render('auth/login', {
              path: "/login",
              pageTitle: 'Login',
              isAuthenticated: false,
              csrfToken: req.csrfToken(),
              errorMessage: 'invalid email or password',
              oldInputs:{
                email:'',
                password:''
              },
              validationErrors:[]
            });
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
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    isAuthenticated: false,
    errorMessage: message,
    oldInputs:{
      name:'',
      email:'',
      password:'',
      confirmPassword: ''
    },
    validationErrors:[]
  });
};
exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    console.log("Error is::",errors.array());
   return res.status(422).render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      isAuthenticated: false,
      errorMessage: errors.array()[0].msg,
      oldInputs:{
        email:email,
        password:password,
        name:name,
        confirmPassword: req.body.confirmPassword
      },
      validationErrors:errors.array()
    });
  }
   bcrypt.hash(password, 12)
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
        }).catch(error => {
        console.log(error);
      });

    

};
exports.postlogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};

exports.getReset = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
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
exports.postReset = (req, res, next) => {
  const email = req.body.email;
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect('/reset');
    }
    const token = buffer.toString('hex');
    User.findOne({
      email: email,

    })
      .then(user => {
        if (!user) {
          req.flash('error', 'No account found with this ' + email);
          return res.redirect('/reset');
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();

      })
      .then(result => {
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
      .catch(error => {
        console.log(error);
      });
  });
};
exports.getNewPassword = (req, res, next) => {
  let token = req.params.token;
  User.findOne({
    resetToken: token,
    resetTokenExpiration: {
      $gt: Date.now()
    }
  })
    .then(user => {
      let message = req.flash('error');
      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }
      res.render('auth/new-password', {
        path: "/new-password",
        pageTitle: 'New Password',
        isAuthenticated: false,
        csrfToken: req.csrfToken(),
        errorMessage: message,
        userId: user._id.toString(),
        passwordToken: token
      });
    })
    .catch(error => {
      console.log(error);
    });

};

exports.postNewPassword = (req, res, next) => {
  const newpassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  let resetuser;
  User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: {
      $gt: Date.now()
    },
    _id: userId
  })
    .then(user => {
      resetuser = user;
      return bcrypt.hash(newpassword, 12);
    })
    .then(hashedpassword => {
      resetuser.password = hashedpassword;
      resetuser.resetToken = undefined;
      resetuser.resetTokenExpiration = undefined;
      return resetuser.save();
    })
    .then(result => {
      res.redirect('/login');
    })
    .catch(error => {
      console.log(error);
    });
};