const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const User = require('../models/User');

passport.serializeUser((user, done) => {
    return done(null, user._id);
});

passport.deserializeUser(async (userId, done) => {
    try {
        const existingUser = await User.findById(userId);
        return done(null, existingUser);
    } catch(error) {
        return done(error);
    }
});

const SALT_ROUNDS = 10;

const registerEstrategy = new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
}, async (req, email, password, done) => {
    try {
        const { subRole } = req.body
        const previousUser = await User.findOne({email});

        if(previousUser){
            const error = new Error('User already exists!')
            return done(error);
        }

        const hash = await bcrypt.hash(password, SALT_ROUNDS);

        const newUser = new User({
            email,
            password: hash,
            subRole,
        });

        const savedUser = await newUser.save();

        return done(null, savedUser);

    } catch(error) {
        return done(error);
    }
});

const loginStrategy = new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,

}, async (req, email, password, done ) => {
    try {
        const currentUser = await User.findOne({email});

        if(!currentUser) {
            const error = new Error('Email or password not valid');
            return done(error);
        }

        const isValidPassword = await bcrypt.compare(password, currentUser.password);

        if (!isValidPassword) {
            const error = new Error('Email or password not valid');
            return done(error);
        }

        return done(null, currentUser);

    } catch(error) {
        return done(error);
    }
});

passport.use('login', loginStrategy);

passport.use('register', registerEstrategy);