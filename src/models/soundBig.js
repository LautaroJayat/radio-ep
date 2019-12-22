const mongoose = require ('mongoose');
const { Schema } = mongoose;

const soundBigSchema = new Schema({
    iframe:  {type: String, required: true}
    
});

module.exports = mongoose.model('SoundBig', soundBigSchema);
