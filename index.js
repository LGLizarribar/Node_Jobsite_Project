require('dotenv').config();
const express = require('express');
const path = require('path');
const passport = require('passport');
const sassMiddleware = require('node-sass-middleware');
const methodOverride = require('method-override');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const db = require('./db.js');
const indexRoutes = require('./routes/index.routes');
const jobsRoutes = require('./routes/jobs.routes');
const authRoutes = require('./routes/auth.routes');



const { isAuthenticated } = require('./middlewares/auth.middleware');


require('./passport/passport');

db.connect();

const PORT = process.env.PORT;

const app = express();

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 48 * 60 * 60 * 1000
    },
    store: MongoStore.create({ mongoUrl: db.DB_URL }),
}));

app.use(
    sassMiddleware({
        src: path.join(__dirname, 'public'),
        dest: path.join(__dirname, 'public'),
        debug: false,
        outputStyle: 'compressed',
    })
);

app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(methodOverride('_method'));

app.use('/', indexRoutes);
app.use('/jobs', [isAuthenticated], jobsRoutes);
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