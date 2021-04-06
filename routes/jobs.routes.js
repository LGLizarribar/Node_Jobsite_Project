const express = require('express');
const JobOffer = require('../models/JobOffer');
const db = require('../db');
const User = require('../models/User');
const router = express.Router();

router.get('/', async (req, res, next) => {
    try{
        const jobOffers = await JobOffer.find();
        return res.render('jobs', {jobOffers: jobOffers, user: req.user});

    } catch(error){
        next(error);
    }
});


router.get('/add-offer', (req, res, next) => {
    return res.render('add-offer', {user: req.user});
})

router.post('/add-offer', async (req, res, next) => {
    const user = req.user;
    const creatorId = user._id;
    if(user){
        try {
            const { position, company, description, contactEmail, location } = req.body;

            const newJobOffer = new JobOffer({creatorId, position, company, description, contactEmail, location });

            const savedJobOffer = await newJobOffer.save();

            return res.status(201).redirect('/jobs').json(savedJobOffer);

        } catch(error) {
            next(error);
        }
    } else {
        return res.redirect('/auth/login');
    }
});

router.get('/edit-offer/:id', async (req, res, next) => {
    if(req.user){
        try {
            const { id } = req.params;

            const job = await JobOffer.findById(id);

            if(job) {
                return res.render('edit-offer', {job, user: req.user});
            } else {
                return res.status(404).json('No job found for this ID');
            }

        } catch(error){
            next(error);
        }
    } else {
        return res.redirect('/auth/login');
    }
})

router.put('/edit-offer', async (req, res, next) => {
    const user = req.user;
    const updaterId = user._id;

    if(user){

        try {

            const { id, position, company, description, contactEmail, location } = req.body;
            const { creatorId } = await JobOffer.findById(id);

            if(creatorId.equals(updaterId)) {

                const updatedJobOffer = await JobOffer.findByIdAndUpdate(id,
                    { position, company, description, contactEmail, location },
                    {
                        new: true
                    });

                    return res.redirect('/jobs');
            } else {
                console.log('This user cannot update this job offer');
                return res.redirect('/auth/login');
            }

        } catch(error) {
            next(error);
        }
    } else {
    return res.redirect('/auth/login');
    }
});

router.delete('/delete-offer', async (req, res, next) => {
    if(req.user){
        try {
            const deleterId = req.user._id;
            const { id } = req.body;
            const { creatorId } = await JobOffer.findById(id);

            if (creatorId.equals(deleterId)){

                const deleted = await JobOffer.findByIdAndDelete(id);

                if(deleted) return res.redirect('/jobs');

                return res.status(404).json('Offer not found');
            } else {
                console.log('This user cannot delete this job offer');
                return res.redirect('/auth/login');
            }

        } catch(error){
            next(error);
        }
    } else {
        return res.redirect('/auth/login');
    }
});

router.put('/apply', async (req, res, next) => {
    if(req.user){
        try {
            const applicantId = req.user._id;
            const { id } = req.body;

            const appliedOffer = await JobOffer.findByIdAndUpdate(
                id,
                {
                    $push: {applicants: applicantId}
                },
                { new: true }
            );
            return res.redirect('/jobs');

        } catch(error){
            next(error);
        }
    } else {
        return res.redirect('/auth/login');
    }
})

router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const job = await JobOffer.findById(id);

        if(job) {
            return res.render('job', {job, user: req.user});
        }

        return res.status(404).json('No job found for this ID');

    } catch(error) {
        next(error);
    }
})

module.exports = router;