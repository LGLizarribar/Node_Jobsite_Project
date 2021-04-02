const express = require('express');
const path = require('path');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const indexRoutes = require('./routes/index.routes');
const jobsRoutes = require('./routes/jobs.routes');
const authRoutes = require('./routes/auth.routes');
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
    store: MongoStore.create({ mongoUrl: db.DB_URL }),
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(passport.initialize());
app.use(passport.session());


app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/', indexRoutes);
app.use('/jobs', jobsRoutes);
app.use('/auth', authRoutes);


app.use('*', (req, res, next) => {
    const error = new Error('Route not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    return res.status(error.status || 500).render('error', {error: error.message || "Unexpected error"});
});

app.listen(PORT, () => {
    console.log(`Server listening in http://localhost:${PORT}`);
});