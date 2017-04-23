const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let BannersPublicidad = new Schema({
    name: String,
    description: String,
    img: String,
    dateCreate: Date,
    dateMod: Date
})

module.exports = mongoose.model('BannersPublicidad', BannersPublicidad);