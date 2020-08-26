var bCrypt = require('bcrypt-nodejs');
var Strategy = require('passport-local').Strategy;
// var dbLayer = require('../modules/dbLayer');
var models = require('../models');
var auth = {};

function generateHash(password) {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
};

function isValidPassword(userpass, password) {
    return bCrypt.compareSync(password, userpass);
}

auth.initializeStrategy = function(passport) {
    passport.use('local', new Strategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        function(req, email, password, cb) {
            console.log(email);console.log(password);
            auth.checkLocalUser( req, email, password, cb ); //change auth to this
        }));

    passport.serializeUser(function(user, cb) {
        console.log('Serialize User', user.id);
        cb(null, user.id);
    });

    passport.deserializeUser(function(id, cb) {
        console.log('deserialize User...', id)
        models.User.findByPk(id).then(function(user) {
            if (user) {
                console.log('found User...')
                return cb(null, user);
            } else {
                // return cb(null);
                console.log('could not find User')
                return cb(null, false);
                // return cb(null, user.id);

            }
        });
    });

};
// in app login function
auth.checkLocalUser = async (req, email, password, cb) => {
  try {
    const user = await models.User.findOne({
      where: {
        email,
      },
    });
    if (!user) {
        console.log('Could not find the email')
      return cb(null, false);
    }
    if (!isValidPassword(user.password, password)) {
        console.log(user.password + ' ' + password + 'do not match')
      return cb(null, false);
    }
    console.log('got the user')
    const userData = await user.get();
    await user.update({
      last_login: Date.now(),
    });
    req.user = userData;
    req.login(userData, () => cb(null, userData));
  } catch (error) {
    console.log(`error${error}`);
    return cb(null, false);
  }
};

auth.checkCredentials = ( email, CurrentBusinessId, password, cb  ) => {
    models.User.findOne({
        where: {
            email: email,
            CurrentBusinessId: CurrentBusinessId
        }
    }).then(function(user) {
        if (!user) {
            return cb(null, false);
        }
        if (!isValidPassword(user.password, password)) {
            return cb(null, false);
        }

        var userinfo = user.get();
        user.update({
            last_login: Date.now()
        })
        return cb(null, userinfo);

    }).catch(function(err) {
        console.log("Error:", err);
        return cb(null, false);
    });
};

auth.createUser = function(req, res, next) {
    var User = models.User;
    User.findOne({
        where: {
            email: req.body.emailReg
        }
    }).then(function(user) {
        if (user) {
            next({
                success: false,
                message: 'That email is already taken'
            });
        } else {
            var userPassword = generateHash(req.body.passwordReg);
            var data = {
                email: req.body.emailReg,
                password: userPassword,
                firstname: req.body.firstnameReg,
                lastname: req.body.lastnameReg
            };

            User.create(data).then(function(newUser, created) {
                if (!newUser) {
                    next({
                        success: false,
                        message: 'Error when trying to create new user'
                    });
                };
                if (newUser) {
                    next({
                        success: true,
                        message: 'User created'
                    });
                };
            });
        };
    });
};

module.exports = auth;
