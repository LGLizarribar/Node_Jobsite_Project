const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        return res.redirect('/auth/login');
    }
}

module.exports = { isAuthenticated };