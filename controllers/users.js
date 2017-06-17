const frankify = require('../frankify')
const NodeMailer = require('nodemailer');
const User = require('.././models/user')
const smtpTransport = require('nodemailer-smtp-transport');

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
	if(req.params.id == null){
		res.status(200).json({})
	}else{
		frankify.findById(User,req.params.id,res);
	}
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
				//console.log(product)
				totals += (product.price * product.cant);
				//console.log(totals)
			}

			return res.status(200).json({
				status: "success", 
				message: "ok",
				total: format(totals),
				totalG: totals
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

exports.userRegister = (req,res) => {
	User.findOne({rut: req.body.rut},(err,response) => {
		if(response == null) {
			if(err) {
			res.status(500).json({message: 'el rut ingresado ya existe en nuestros registros este es un error', error: err})
			}else{
				let usuario = new User({
					rut: req.body.rut,
					name: req.body.name,
					apellido: req.body.apellido,
					mail: req.body.mail,
					phone: req.body.phone,
					username: req.body.username,
					password:req.body.password,
					admin: req.body.admin,
					date: new Date()
				})

				usuario.save((err, response) => {
					if(err){
						res.status(500).json({
							message:'Error al crear el usuario, intentelo mas tarde',
							error: err,
							status: 'error'
						})
					}else{
						res.status(200).json({
							message:'Registro creado con exito',
							status: 'success',
							data: response
						})
					}
				})
			}
		}else {
			res.status(500).json({message: 'el rut ingresado ya existe en nuestros registros'})
		}
	})
}


exports.recover = (req,res) => {
	User.findOne({mail: req.body.mail},(err,response) => {
		if(response === null){
			res.status(500).json({status:'error',message: 'El usuario no existe'})
		}else{
			let template = `	<section>
									<br><h3>Mensaje de recuperacion de password</h3><br>
									<hr>
									<br>
									<h4> Estimado usuario ${response.name} ${response.apellido}</h4>
									<p>sus datos de acceso para ingresar a nuestro sitio son:</p>
									<br>
									<br>
									<h4>Correo: <b>${response.mail}</b></h4>
									<h4>Password: <b>${response.password}</b></h4>
									<br>
									<br>
									<br>
									<h3><b>Atte.</b></h3>
									<h3><b>El equipo de Videomanias.cl</b></h3>
								</section>
							`


			let mailOptions = {
				from: 'Videomanias.cl',
				to: response.mail,
				subject: 'recuperacion de password Videomanias.cl',
				html: template
			};

			/*let smtpConfig = {
				host: 'mail.dowhile.cl',
				port: 587,
				tls: {
					rejectUnauthorized:false
				},
				secure: false, // upgrade later with STARTTLS
				auth: {
					user: 'info@dowhile.cl',
					pass: 'd0wh1l3' 
				}
			};*/

			//let transporter = NodeMailer.createTransport(smtpConfig);

			let transporter = NodeMailer.createTransport(smtpTransport({
				service: 'gmail',
				auth: {
					user: 'no.reply.videomanias@gmail.com',
					pass: 'videomanias2017'
				}
			}));

			transporter.sendMail(mailOptions, function(error, info){
			if (error){
				console.log(error);
				res.status(200).json({
					status:'error',
					message: 'error al enviar la contraseña',
					data: error
				});
			} else {
				console.log("Email sent");
				res.status(200).json({
					status:'success',
					message: 'Clave envia a su correo electronico',
					data: info
				});
			}
		});
		}
			
	})
}