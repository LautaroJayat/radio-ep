const mongoose = require('mongoose');

function dburi() {
    if (process.env.ENV === 'test') {
        return 'radioep-testing'
    }
    if (process.env.ENV === 'dev') {
        return 'radioep-dev'
    }
    if (process.env.ENV === 'prod' || !process.env.ENV) {
        return 'radioentrepiernas'
    }
};

const DBURI = dburi();


const DB = mongoose.connect('mongodb://localhost/' + DBURI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(() => {
    console.log('Everything seems ok in DB')
});

mongoose.connection.on('connected', () => {
    console.log('Mongoose is connected to', DBURI);
});

mongoose.connection.on('error', () => {
    console.log('There was an error in Mongoose')
});

process.on('SIGINT', () => {
    mongoose.connection.close((err) => {
        if (err) {
            console.log(err)
        }
        console.log('Mongoose connection closed due to app termination');
        process.exit(0);
    });
});

module.exports = { DB }