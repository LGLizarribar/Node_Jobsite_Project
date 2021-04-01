const mongoose = require('mongoose');

const DB_URL = 'mongodb://localhost:27017/semana-santa-proyecto';

const connect = async () => {
    try {
        await mongoose.connect(DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to DB');

    } catch (error) {
        console.log('Error connecting to DB', error);
    }
}

module.exports = { connect, DB_URL };