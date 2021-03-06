require('dotenv').config();
const mongoose = require('mongoose');
const db = require('../db');

const JobOffer = require('../models/JobOffer');

const jobOffers = [
    {
        creatorId: '6066ff5b1a93cae26ff59fbc',
        position: 'Junior Front-End Developer',
        company: 'Google',
        description: 'Junior at Google',
        contactEmail: 'junior@google.com',
        location: 'Madrid',
        companyLogo: 'https://rotulosmatesanz.com/wp-content/uploads/2017/09/2000px-Google_G_Logo.svg_.png'
    },{
        creatorId: '6066ff5b1a93cae26ff59fbc',
        position: 'Senior Full-Stack Developer',
        company: 'Microsoft',
        description: 'Senior at Microsoft',
        contactEmail: 'senior@microsoft.com',
        location: 'Barcelona',
        companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/1024px-Microsoft_logo.svg.png'
    },{
        creatorId: '6066ff5b1a93cae26ff59fbc',
        position: 'Junior Full-Stack Developer',
        company: 'Spotify',
        description: 'Junior at Spotify',
        contactEmail: 'junior@spotify.com',
        location: 'London',
        companyLogo: 'https://w7.pngwing.com/pngs/67/313/png-transparent-spotify-podcast-spotify-logo-text-logo-music-download.png'
    },
];

mongoose
    .connect(db.DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then( async () => {
        //search for jobOffers in DB
        const allJobOffers = await JobOffer.find();

        //If any, delete them. If not, continue
        if(allJobOffers.length) {
            await JobOffer.collection.drop();
        }
    })
    .catch(error => {
        //manage error getting data
        console.log('Error deleting data: ', error);

    })
    .then ( async () => {
        //Add job offers from seed to db
        await JobOffer.insertMany(jobOffers);

    })
    .catch(error => {
        //manage error creating data
        console.log('Error adding data to DB: ', error);
    })
    .finally(() => {
        //Disconnect from db in any case
        mongoose.disconnect();
    });