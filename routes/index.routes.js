const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    return res.render('index', {
        title: 'Welcome to JobFinder',
        content: "If you're searching for your dream job, you're in the right place!"
    })
});

module.exports = router;