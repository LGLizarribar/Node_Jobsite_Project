const express = require('express');
const passport = require('passport');

const router = express.Router();

router.post('/', (req, res, next) => {
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
    })(req);
})

module.exports = router;