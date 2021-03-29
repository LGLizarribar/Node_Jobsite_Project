const express = require('express');

const PORT: 3000;

const app = express();

app.listen(PORT, () => {
    console.log(`Server listening in http://localhost:${PORT}`);
});