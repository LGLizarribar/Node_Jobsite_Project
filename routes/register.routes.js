const express = require('express');
const passport = require('passport');

const router = express.Router();

router.post('/', (req, res, next) => {
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
})

module.exports = router;