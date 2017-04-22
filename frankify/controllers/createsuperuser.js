const User = require('.././models/user')

exports.createSuperUser = (req,res) => {
	let user = new User({
		name: 'admin',
		password: 'admin',
		admin: true,
		date: new Date()
	})

	user.save(err => {
		if (err) {
			return res.status(500).send({message: err})
		}
		return res.status(200).send({message: "Super Usuario creado exitosamente!"})
	})
}