const express = require('express');
const indexRoutes = require('./routes/index.routes');
const jobsRoutes = require('./routes/jobs.routes');
const db = require('./db.js');
db.connect();

const PORT = 3000;

const app = express();

app.use('/', indexRoutes);
app.use('/jobs', jobsRoutes);


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