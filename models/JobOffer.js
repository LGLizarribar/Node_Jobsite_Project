const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const jobOfferSchema = new Schema({
    creatorId: {type: mongoose.Types.ObjectId, ref: 'User'},
    position: {type: String, required: true},
    company: {type: String, required: true},
    description: {type: Text, required: true},
    contactEmail: {type: String, required: true},
    location: {type: String, required: false},
    applicants: [{type: mongoose.Types.ObjectId, ref: 'User'}],
},{
    timestamps: true,
});

const JobOffer = mongoose.model('JobOffer', jobOfferSchema);

module.exports = JobOffer;