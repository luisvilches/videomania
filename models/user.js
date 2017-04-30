const mongoose = require('mongoose')
let Schema = mongoose.Schema;

let User = new Schema({
	rut: String,
	name: String,
	apellido: String,
	mail: String,
	phone: String,
	username: String,
	password:String,
	admin: Boolean,
	cart:[
		{
			cant: Number,
			sku: String,
			item: String,
			price: Number
		}
	],
	date: Date
})

module.exports = mongoose.model('User', User)
