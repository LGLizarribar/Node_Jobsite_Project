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

router.put('/edit-offer', async (req, res, next) => {
    try {
        const {id} = req.body;
        const { position, company, description, contactEmail, location } = req.body;

        const updatedJobOffer = await JobOffer.findByIdAndUpdate(id,
            { position, company, description, contactEmail, location },
            {
                new: true
            });

            return res.status(200).json(updatedJobOffer);

    } catch(error) {
        next(error);
    }
});

module.exports = router;