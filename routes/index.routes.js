const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    return res.render('index', {
        title: 'Bienvenido a JobFinder',
        content: "Si estás buscando tu trabajo soñado, ¡estás en el lugar adecuado!",
        user: req.user,
    })
});

module.exports = router;