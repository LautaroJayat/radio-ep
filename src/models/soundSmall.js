const mongoose = require ('mongoose');
const { Schema } = mongoose;

const soundSmallSchema = new Schema({
    iframe: {type: String, required: true}
    
});

module.exports = mongoose.model('SoundSmall', soundSmallSchema);
