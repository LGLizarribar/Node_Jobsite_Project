const express = require('express');
const passport = require('passport');
const indexRoutes = require('./routes/index.routes');
const jobsRoutes = require('./routes/jobs.routes');
const registerRoutes = require('./routes/register.routes');
const db = require('./db.js');

require('./passport/passport');

db.connect();

const PORT = 3000;

const app = express();

app.use(passport.initialize());

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/', indexRoutes);
app.use('/jobs', jobsRoutes);
app.use('/register', registerRoutes);


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