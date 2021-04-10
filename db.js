const mongoose = require('mongoose');

const DB_URL = process.env.DB_URL;

const connect = async () => {
    try {
        await mongoose.connect(DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
        });
        console.log('Connected to DB');

    } catch (error) {
        console.log('Error connecting to DB', error);
    }
}

module.exports = { connect, DB_URL };