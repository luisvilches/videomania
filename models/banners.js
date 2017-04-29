const mongoose = require('mongoose');
const random = require('mongoose-simple-random');
const Schema = mongoose.Schema;

let Banners = new Schema({
    category: String,
    img: String,
    dateCreate: Date,
    dateMod: Date
})

Banners.plugin(random);

module.exports = mongoose.model('Banners', Banners);