const mongoose = require('mongoose');
const { Schema } = mongoose;

const emitionSchema = new Schema({
    url: { type: String, required: true },
    title: { type: String, required: true },
    program:{type:String, required: true},
    description: { type: String, required: false },
    iframe: { type: String, required: true },
    body: { type: String, required: false },
    thumbnail: { type: String, required: false },
    link: { type: String, required: false },
    date: {type: String, required: false}
});

module.exports = mongoose.model('Emition', emitionSchema);
