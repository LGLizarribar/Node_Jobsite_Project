const express = require('express');
const JobOffer = require('../models/JobOffer');
const db = require('../db');
const router = express.Router();

router.get('/', async (req, res, next) => {
    try{
        const jobOffers = await JobOffer.find();
        return res.json(jobOffers);

    } catch(error){
        next(error);
    }
});

module.exports = router;