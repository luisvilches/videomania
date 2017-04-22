const mongoose = require('mongoose')
let Schema = mongoose.Schema;

let User = new Schema({
	name: String,
	password:String,
	admin: Boolean,
	date: Date
})

module.exports = mongoose.model('User', User)
