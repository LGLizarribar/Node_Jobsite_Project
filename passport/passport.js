const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const User = require('../models/User');

/**
 * {
 *      email: 'laura@upgrade.com',
 *      password: '12345'
 * }
 */

const SALT_ROUNDS = 10;

const registerEstrategy = new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
}, async (req, email, password, done) => {
    try {
        const previousUser = await User.findOne({email})

        if(previousUser){
            const error = new Error('User already exists!')
            return done(error);
        }

        const hash = await bcrypt.hash(password, SALT_ROUNDS);

        const newUser = new User({
            email,
            password: hash,
        });

        const savedUser = await newUser.save();

        done(null, savedUser);

    } catch(error) {
        return done(error);
    }
})

passport.use('register', registerEstrategy);