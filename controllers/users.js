const frankify = require('../frankify')
const User = require('.././models/user')

// Function to show all Users
exports.users = (req,res) => {
    frankify.find(User,res);
}

// Function create User
exports.createuser = (req,res) => {
    frankify.create(User,{
        name: req.body.name,
		password: req.body.password,
		admin: req.body.admin,
		date: new Date()
    },res);
}

// Function to find by id User
exports.userid = (req,res) => {

   frankify.findById(User,req.params.id,res);

}
// function findOne
exports.one = (req,res) => {
    frankify.findOne(User,{name:req.body.name},res);
}

// function delete
exports.delete = (req,res) => {
    frankify.delete(User,req.params.id,res);
}

//function update
exports.update = (req,res) => {
    frankify.update(User,req.params.id,{
		_id: req.params.id,
		name: req.body.name,
		password: req.body.password,
		admin: req.body.admin,
		date: new Date()
	},res);
}