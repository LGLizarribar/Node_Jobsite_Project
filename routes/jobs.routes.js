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


router.post('/add-offer', async (req, res, next) => {
    try {
        const { position, company, description, contactEmail, location } = req.body;

        const newJobOffer = new JobOffer({ position, company, description, contactEmail, location });

        const savedJobOffer = await newJobOffer.save();

        return res.status(201).json(savedJobOffer);

    } catch(error) {
        next(error);
    }
});

module.exports = router;