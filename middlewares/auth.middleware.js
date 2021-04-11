const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        return res.redirect('/auth/login');
    }
}

const isAdmin = (req, res, next) => {
    if (req.isAuthenticated()) {
        if (req.user.role === 'admin') {
            return next();
        } else {
            const error = new Error('Forbidden page');
            error.status=403;
            return next(error);
        }
    } else {
        return res.redirect('/auth/login');
    }
}

module.exports = { isAuthenticated, isAdmin };