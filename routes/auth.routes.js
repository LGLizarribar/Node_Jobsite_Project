const express = require('express');
const passport = require('passport');
const { isAuthenticated, isAdmin } = require('../middlewares/auth.middleware');
const User = require('../models/User');

const router = express.Router();

router.get('/register', (req, res, next) => {
    return res.render('register');
})

router.post('/register', (req, res, next) => {
    const { email, password } = req.body;

    if(!email || !password) {
        const error = new Error('User and password are required');
        return res.render('register', {error: error.message});
    }

    passport.authenticate('register', (error, user) => {
        if(error) {
            return res.render('register', {error: error.message});
        }
        return res.redirect('/auth/login');
    })(req);
});

router.get('/login', (req, res, next) => {
    return res.render('login');
})

router.post('/login', (req, res, next) => {
    const { email, password } = req.body;

    if(!email || !password) {
        const error = new Error('User and password are required');
        return res.render('login', {error: error.message});
    }

    passport.authenticate('login', (error, user) => {
        if(error) {
            return res.render('login', {error: error.message});
        }
        req.logIn(user, (error) => {
            if(error){
                return res.render('login', {error: error.message});
            }
            return res.redirect('/jobs');
        })
    })(req, res, next);
});

router.post('/logout', (req, res, next) => {
    if(req.user) {
        req.logout();

        req.session.destroy(() => {
            res.clearCookie('connect.sid');
            return res.redirect('/');
        })
    } else {
    return res.redirect('/auth/login');
    }
});

router.get('/users', [isAdmin], async (req, res, next) => {
    try {
        const users = await User.find();
        return res.render('users', { users: users, isAdmin: req.user.role === 'admin', user: req.user});

    } catch(err) {
        next(err);
    }
})

router.delete('/delete-user', [isAdmin], async (req, res, next) => {
    try {
        const { id } = req.body;

        const deletedUser = await User.findByIdAndDelete(id);

        if(deletedUser) return res.redirect('/auth/users');

        return res.status(404).json('User not found');

    } catch(error) {
        next(error);
    }
});

module.exports = router;