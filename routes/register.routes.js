const express = require('express');
const passport = require('passport');

const router = express.Router();

router.post('/', (req, res, next) => {
    const { email, password } = req.body;

    console.log('Registering user...', req.body);

    if(!email || !password) {
        const error = new Error('No user or password found');
        return res.send(200).json(error);
    }

    passport.authenticate('register', (error, user) => {
        if(error) {
            return res.send(error);
        }
        return res.send(user);
    })(req);
})

module.exports = router;