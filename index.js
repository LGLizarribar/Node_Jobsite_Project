const express = require('express');
const passport = require('passport');
const session = require('express-session');
const indexRoutes = require('./routes/index.routes');
const jobsRoutes = require('./routes/jobs.routes');
const registerRoutes = require('./routes/register.routes');
const loginRoutes = require('./routes/login.routes');
const db = require('./db.js');

require('./passport/passport');

db.connect();

const PORT = 3000;

const app = express();

app.use(session({
    secret: 'sdbaljsf*2524@',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 48 * 60 * 60 * 1000
    },
}));

app.use(passport.initialize());
app.use(passport.session());


app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/', indexRoutes);
app.use('/jobs', jobsRoutes);
app.use('/register', registerRoutes);
app.use('/login', loginRoutes);


app.use('*', (req, res, next) => {
    const error = new Error('Route not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    return res.status(error.status || 500).json(error.message || "Unexpected error");
});

app.listen(PORT, () => {
    console.log(`Server listening in http://localhost:${PORT}`);
});