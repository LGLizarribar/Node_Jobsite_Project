const express = require('express');
const JobOffer = require('../models/JobOffer');
const db = require('../db');
const User = require('../models/User');
const router = express.Router();

router.get('/', async (req, res, next) => {
    try{
        const jobOffers = await JobOffer.find();
        return res.render('jobs', {jobOffers: jobOffers});

    } catch(error){
        next(error);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const job = await JobOffer.findById(id);

        if(job) {
            return res.render('job', {job});
        }

        return res.status(404).json('No job found for this ID');

    } catch(error) {
        next(error);
    }
})


router.post('/add-offer', async (req, res, next) => {
    const user = req.user;
    const creatorId = user._id;
    if(user){
        try {
            //const userId = await User.findOne{ _id : user };
            const { position, company, description, contactEmail, location } = req.body;

            const newJobOffer = new JobOffer({creatorId, position, company, description, contactEmail, location });

            const savedJobOffer = await newJobOffer.save();

            return res.status(201).json(savedJobOffer);

        } catch(error) {
            next(error);
        }
    } else {
        return res.redirect('/auth/login');
    }
});

router.put('/edit-offer', async (req, res, next) => {
    try {
        const { id, position, company, description, contactEmail, location } = req.body;

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

router.delete('/delete-offer/:id', async (req, res, next) => {
    try {
        const { id } = req.params;

        const deleted = await JobOffer.findByIdAndDelete(id);

        if(deleted) return res.status(200).json('Offer deleted');

        return res.status(404).json('Offer not found');

    } catch(error){
        next(error);
    }
})

module.exports = router;