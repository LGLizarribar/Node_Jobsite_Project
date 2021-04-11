const express = require('express');
const JobOffer = require('../models/JobOffer');
const db = require('../db');
const User = require('../models/User');
const router = express.Router();
const { upload, uploadToCloudinary } = require('../middlewares/files.middleware');

router.get('/', async (req, res, next) => {
    try {
        const jobOffers = await JobOffer.find();
        return res.render('jobs', { jobOffers: jobOffers, user: req.user, isAdmin: req.user.role === "admin"});

    } catch (error) {
        next(error);
    }
});


router.get('/add-offer', (req, res, next) => {
    return res.render('add-offer', { user: req.user });
})

router.post('/add-offer', [upload.single('companyLogo'), uploadToCloudinary], async (req, res, next) => {
    const creatorId = req.user._id;

    try {
        const { position, company, description, contactEmail, location } = req.body;

        const companyLogo = req.file_url;

        const newJobOffer = new JobOffer({ creatorId, position, company, description, contactEmail, location, companyLogo });

        await newJobOffer.save();

        return res.redirect('/jobs');

    } catch (error) {
        next(error);
    }
});

router.get('/edit-offer/:id', async (req, res, next) => {

    try {
        const { id } = req.params;

        const job = await JobOffer.findById(id);

        if (job) {
            return res.render('edit-offer', { job, user: req.user });
        } else {
            return res.status(404).json('No job found for this ID');
        }

    } catch (error) {
        next(error);
    }
})

router.put('/edit-offer', [upload.single('companyLogo'), uploadToCloudinary], async (req, res, next) => {
    const updaterId = req.user._id;

    try {

        const { id, position, company, description, contactEmail, location } = req.body;

        const companyLogo = req.file_url;

        const { creatorId } = await JobOffer.findById(id);

        if (creatorId.equals(updaterId)) {

            await JobOffer.findByIdAndUpdate(id,
                { position, company, description, contactEmail, location, companyLogo },
                {
                    new: true
                });

            return res.redirect('/jobs');
        } else {
            console.log('This user cannot update this job offer');
            return res.redirect('/auth/login');
        }

    } catch (error) {
        next(error);
    }
});

router.delete('/delete-offer', async (req, res, next) => {

    try {
        const deleterId = req.user._id;
        const { id } = req.body;
        const { creatorId } = await JobOffer.findById(id);

        if (creatorId.equals(deleterId)) {

            const deleted = await JobOffer.findByIdAndDelete(id);

            if (deleted) return res.redirect('/jobs');

            return res.status(404).json('Offer not found');
        } else {
            console.log('This user cannot delete this job offer');
            return res.redirect('/auth/login');
        }

    } catch (error) {
        next(error);
    }

});

router.put('/apply', async (req, res, next) => {

    try {
        const applicantId = req.user._id;
        const { id } = req.body;

        const appliedOffer = await JobOffer.findByIdAndUpdate(
            id,
            {
                $push: { applicants: applicantId }
            },
            { new: true }
        );
        return res.redirect('/jobs');

    } catch (error) {
        next(error);
    }
})

router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const job = await JobOffer.findById(id);

        if (job) {
            return res.render('job', { job, user: req.user, isAdmin: req.user.role === "admin"});
        }

        return res.status(404).json('No job found for this ID');

    } catch (error) {
        next(error);
    }
})

module.exports = router;