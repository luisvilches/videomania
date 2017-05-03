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



exports.addToCart = (req,res) => {
	User.findByIdAndUpdate(req.params.id,
		{$push: {"cart": {
			cant: req.body.cant,
			sku: req.body.sku ,
			item: req.body.item,
			price: req.body.price
		}}},
		{safe: true, upsert: true},
		function(err, response) {
			if(err) {
				return res.status(500).json({
					status:"error", 
					message: err
				})
			}
			else {
				return res.status(200).json({
					status: "success", 
					message: "imagen agregada con exito",
					data: response
				})
			}
		}
	);
}

exports.deleteToCart = (req,res) =>{
	let id = req.params.id
	User.findOne({'cart._id': id}, function (err, result) {
        result.cart.id(id).remove();
        result.save((err) => {
			if(err) {
				return res.status(500).json({
					status:"error", 
					message: err
				})
			}
			else {
				return res.status(200).json({
					status: "success", 
					message: "elimiado con exito"
				})
			}
		});            
    });
}

exports.totalCard = (req,res) => {
	User.findOne({_id: req.params.id},(err,response) => {
		if(err) {
			return res.status(500).json({
				status:"error", 
				message: err
			})
		}
		else {

			var totals = 0;
			for(var i = 0; i < response.cart.length; i++){
				var product = response.cart[i];
				console.log(product)
				totals += (product.price * product.cant);
				console.log(totals)
			}

			return res.status(200).json({
				status: "success", 
				message: "ok",
				total: format(totals)
			})
		}
	})
}

function format(valor){
	if(valor === null){
		valor = 0;
		return valor;
	}
	else {
		var num = valor.toString().replace(/\./g,'');
		if(!isNaN(num)){
			num = num.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g,'$1.');
			num = num.split('').reverse().join('').replace(/^[\.]/,'');
			valor = num;
			return valor
		} else { 
			console.log('Solo se permiten numeros');
			valor = valor.replace(/[^\d\.]*/g,'');
		}
	}
}