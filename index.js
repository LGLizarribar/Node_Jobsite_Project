const express = require('express');
const indexRoutes = require('./routes/index.routes');
const db = require('./db.js');
db.connect();

const PORT = 3000;

const app = express();

app.use('/', indexRoutes);

app.listen(PORT, () => {
    console.log(`Server listening in http://localhost:${PORT}`);
});