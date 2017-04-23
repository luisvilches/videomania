const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Product = new Schema({
    sku: String,
    category: String,
    family: String,
    gender: String,
    name: String,
    nameUrl: String,
    description: String,
    price: String,
    priceIva: String,
    premiere: Boolean,
    offer: Boolean,
    image: String,
    media: String,
    dateCreate: Date,
    dateMod: Date
})

module.exports = mongoose.model('Product', Product);