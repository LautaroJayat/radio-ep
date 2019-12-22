const mongoose = require('mongoose');
const { Schema } = mongoose;

const columnSchema = new Schema({
    url: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: false },
    program: {type: String, required: false},
    iframe: { type: String, required: false },
    body: { type: String, required: false },
    thumbnail: { type: String, required: false },
    link: { type: String, required: false },
    date: { type: String, required: false }
});

module.exports = mongoose.model('Column', columnSchema);
