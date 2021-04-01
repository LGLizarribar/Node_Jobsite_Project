const express = require('express');
const passport = require('passport');
const User = require('../models/User');

const router = express.Router();

router.post('/register', (req, res, next) => {
    const { email, password } = req.body;

    console.log('Registering user...', req.body);

    if(!email || !password) {
        const error = new Error('User and password are required');
        return res.send(200).json(error.message);
    }

    passport.authenticate('register', (error, user) => {
        if(error) {
            return res.json(error.message);
        }
        return res.send(user);
    })(req);
});

router.post('/login', (req, res, next) => {
    const { email, password } = req.body;
    console.log('Logueando usuario...', req.body);

    if(!email || !password) {
        const error = new Error('User and password are required');
        return res.json(error.message);
    }

    passport.authenticate('login', (error, user) => {
        if(error) {
            return res.json(error.message);
        }
        req.logIn(user, (error) => {
            if(error){
                return res.json(error.message);
            }
            return res.json(user);
        })
    })(req, res, next);
});

router.post('/logout', (req, res, next) => {
    if(req.user) {
        req.logout();

        req.session.destroy(() => {
            res.clearCookie('connect.sid');
        })
        return res.json('User succesfully logged out');
    }
    return res.json('No user found');
});

router.delete('/delete-user/:id', async (req, res, next) => {
    try {
        const { id } = req.params;

        const deletedUser = await User.findByIdAndDelete(id);

        if(deletedUser) return res.status(200).json('User deleted');

        return res.status(404).json('User not found');

    } catch(error) {
        next(error);
    }
});

module.exports = router;