const mongoose = require('mongoose');
const { Schema } = mongoose;

const bcrypt = require('bcryptjs');

const UserSchema = new Schema({
    name: { type: String, required: true },
    password: { type: String, required: true },
    admin: { type: Boolean, default: false },
    email: { type: String, required: false },
    photo: { type: String, required: false },
    thumbnail: { type: String, required: false },
    //news: { type: Number },//[{ type: String, required: false }],
    //columns: { type: Number, required: false },
    //emitions: { type: Number, required: false },
    facebook: { type: String, required: false },
    twitter: { type: String, required: false },
    instagram: { type: String, required: false }

});

UserSchema.methods.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
};

UserSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);
