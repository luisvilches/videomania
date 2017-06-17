const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Transaccion = new Schema({
    date: String,
    commerceCode:Number,
    buyOrder: String,
    amount: String,
    authCode: String,
    clientId: String,
    token: String
})

module.exports = mongoose.model('Transaccion', Transaccion);