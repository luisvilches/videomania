const mongoose = require('mongoose');
const random = require('mongoose-simple-random');
const Schema = mongoose.Schema;

let BannersPublicidad = new Schema({
    name: String,
    description: String,
    img: String,
    dateCreate: Date,
    dateMod: Date
})

BannersPublicidad.plugin(random);

module.exports = mongoose.model('BannersPublicidad', BannersPublicidad);