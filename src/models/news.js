const mongoose = require('mongoose');
const { Schema } = mongoose;

const newsSchema = new Schema({
    url: { type: String, required: false },
    title: { type: String, required: true },
    description: { type: String, required: false },
    headline: { type: String, required: false },
    author: { type: String, required: true },
    alt_author: { type: String, required: false },
    alt_source: { type: String, required: false },
    alt_source_link: { type: String, required: false },
    alt_social:  { type: String, required: false },
    author_instagram: { type: String, required: false },
    author_facebook: { type: String, required: false },
    author_twitter: { type: String, required: false },
    author_thumbnail: { type: String, required: false },
    author_id: { type: String, required: true },
    body: { type: String, required: false },
    photo: { type: String, required: false },
    thumbnail: { type: String, required: false },
    link: { type: String, required: false },
    date: { type: String, required: false }
});


module.exports = mongoose.model('News', newsSchema);
