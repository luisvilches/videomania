const cloudinary = require('cloudinary')
const Model = require('.././models/product');
const Transaction = require('.././models/transaccion');
const User = require('.././models/user')
const WebPay = require('webpay-nodejs');
const fs = require('fs');
const path = require('path');
const public = require('.././keys/public');
const private = require('.././keys/private');
const webpaykey = require('.././keys/webpaykey');

const wp = new WebPay({
    commerceCode: '597020000541',
    publicKey: public,
    privateKey: private,
    webpayKey: webpaykey
});

var transactions = {};



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


exports.find = (req,res) => {
    Model.find((err,response) => {
        if(err){ 
            return res.status(500).json({
                status:"error", 
                message: `Error: ${err}` 
            })
        }
        else{
            return res.status(200).json({
                status: 'success', 
                total: response.length, 
                data: response,
                //price: format(response.price)
            }
        )}
    })
}


exports.create = (req,res) => {
    let media = req.body.media.split('=');
    let file = req.files.img;
    let filename = req.files.img.name;

    file.mv(`./uploads/${filename}`, (err) => {
        if(err) {
            return res.status(500).json({status: 'error',message: err})
        }
        else {
            cloudinary.uploader.upload(`./uploads/${filename}`, function(result) { 
                let title = req.body.name;

                 let data = new Model({
                    sku: req.body.sku,
                    category: req.body.category,
                    family: req.body.family,
                    gender: req.body.gender,
                    name: req.body.name,
                    nameUrl: title.replace(/ /g,"-").toLowerCase(),
                    description: req.body.description,
                    price: req.body.price,
                    priceIva: Math.round(req.body.price * 1.19),
                    premiere: req.body.premiere,
                    offer: req.body.offer,
                    image: result.secure_url,
                    media: req.body.media,
                    videoId: media[1],
                    gallery: [
                        {
                            original: result.secure_url,
                            thumbnail: result.secure_url,
                            size: 300
                        }
                    ],
                    dateCreate: new Date(),
                    dateMod: new Date()
                })

                data.save((err,response) => {
                    if(err){
                        return res.status(500).json({
                            status:"error", 
                            message: `Error: ${err}` 
                        })
                    }
                    else{
                        return res.status(200).json({ 
                            status: "success", 
                            message: "registro creado con exito", 
                            data: response
                        })
                    }
                })
            });
        }
    })
}

exports.addGallery = (req,res) => {

    let file = req.files.image;
    let filename = req.files.image.name;

    file.mv(`./uploads/${filename}`, (err) => {
        if(err) {
            return res.status(500).json({status: 'error',message: err})
        }
        else {
            cloudinary.uploader.upload(`./uploads/${filename}`, function(result) { 
                let imageGallery = result.secure_url;

                Model.findByIdAndUpdate(req.params.id,
                    {$push: {"gallery": {original: imageGallery,thumbnail: imageGallery ,size: 300}}},
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
            });
        }
    })
}

exports.deleteGallery = (req,res) =>{
	let id = req.params.id
	Model.findOne({'gallery._id': id}, function (err, result) {
        result.gallery.id(id).remove();
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

exports.delete = (req,res) => {

    let id = req.params.id;

    Model.remove({_id: id},err => {
      if(err){
          return res.status(500).json({
              status: 'error', 
              message: `Error: ${err}` 
            })
        } 
      else{ 
          return res.status(200).json({
              status:'success', 
              message: `Registro ID: ${id} eliminado satisfactoriamente`
            })
        }
   })
}

exports.update = (req,res) => {

    let id = req.params.id;
    let title = req.body.name;

    let data = new Model({
        _id: req.params.id,
        sku: req.body.sku,
        category: req.body.category,
        family: req.body.family,
        gender: req.body.gender,
        name: req.body.name,
        nameUrl: title.replace(/ /g,"-").toLowerCase(),
        pie: req.body.pie,
        description: req.body.description,
        price: req.body.price,
        priceIva: Math.round(req.body.price * 1.19),
        premiere: req.body.premiere,
        offer: req.body.offer,
        media: req.body.media,
        dateMod: new Date()
    });

    Model.update({_id: id},data,(err,response) =>{
        if(err){ 
            return res.status(500).json({
                status: 'error', 
                message: `Error: ${err}` 
            })
        } 
        else{ 
            return res.status(200).json({
                status:'success', 
                message: `Registro ID: ${id} Actualizado satisfactoriamente`, 
                data: response
            })
        }
    })	
}

exports.updateImage = (req,res) => {

    let id = req.params.id;
    let file = req.files.img;
    let filename = req.files.img.name;

    file.mv(`./uploads/${filename}`, (err) => {
        if(err) {
            return res.status(500).json({status: 'error',message: err})
        }
        else {
            cloudinary.uploader.upload(`./uploads/${filename}`, function(result) { 
                let data = new Model({
                    _id: req.params.id,
                    image: result.secure_url,
                });

                Model.update({_id: id},data,(err,response) =>{
                    if(err){ 
                        return res.status(500).json({
                            status: 'error', 
                            message: `Error: ${err}` 
                        })
                    } 
                    else{ 
                        return res.status(200).json({
                            status:'success', 
                            message: `Imagen de ID: ${id} Actualizada satisfactoriamente`, 
                            data: response
                        })
                    }
                })
                
            });
        }
    })
}

exports.premiere = (req,res) => {
    let id = req.params.id;

    let data = new Model({
        _id: req.params.id,
        premiere: req.body.premiere
    });

    Model.update({_id: id},data,(err,response) =>{
        if(err){ 
            return res.status(500).json({
                status: 'error', 
                message: `Error: ${err}` 
            })
        } 
        else{ 
            return res.status(200).json({
                status:'success', 
                message: `Cambio de estado actualizado`, 
                data: response
            })
        }
    })	
}

exports.offer = (req,res) => {
    let id = req.params.id;

    let data = new Model({
        _id: req.params.id,
        offer: req.body.premiere
    });

    Model.update({_id: id},data,(err,response) =>{
        if(err){ 
            return res.status(500).json({
                status: 'error', 
                message: `Error: ${err}` 
            })
        } 
        else{ 
            return res.status(200).json({
                status:'success', 
                message: `Cambio de estado actualizado`, 
                data: response
            })
        }
    })	
}

exports.findName = (req,res) => {
    Model.findOne({nameUrl: req.params.name}, (err,response) => {
        if(err){
            return res.status(500).json({
                status:'error',
                message: err
            })
        }
        else{
            return res.status(200).json({
                status:'success',
                message:'registro encontrado', 
                data: response
            })
        }
    })
}

exports.findById = (req,res) => {
    Model.findById({_id: req.param.id}, (err,response) => {
        if(err){
            return res.status(500).json({
                status:"error",
                message: err
            })
        }
        else{
            return res.status(200).json({
                status:'success',
                message: 'registro encontrado con exito',
                data: response
            })
        }
    })
}

exports.findCategory = (req,res) => {
    Model.find({category: req.params.category},(err,response) => {
        if(err) {
            return res.status(500).json({
                status: 'error',
                message: err
            })
        }
        else{
            return res.status(200).json({
                status: 'success',
                message: 'Registos encontrados con exito',
                data: response
            })
        }
    })
}

exports.findFamily = (req,res) => {
    Model.find({family: req.params.family},(err,response) => {
        if(err) {
            return res.status(500).json({
                status: 'error',
                message: err
            })
        }
        else{
            return res.status(200).json({
                status: 'success',
                message: 'Registos encontrados con exito',
                data: response
            })
        }
    })
}

exports.findGender = (req,res) => {
    Model.find({gender: req.params.gender},(err,response) => {
        if(err) {
            return res.status(500).json({
                status: 'error',
                message: err
            })
        }
        else{
            return res.status(200).json({
                status: 'success',
                message: 'Registos encontrados con exito',
                data: response
            })
        }
    })
}

exports.premiere = (req,res) => {
    Model.find({category: req.params.category,premiere: true},(err,response) => {
        if(err) {
            return res.status(500).json({
                status: 'error',
                message: err
            })
        }
        else{
            return res.status(200).json({
                status: 'success',
                message: 'Registos encontrados con exito',
                data: response
            })
        }
    })
}
exports.premiereall = (req,res) => {
    Model.find({premiere: true},(err,response) => {
        if(err) {
            return res.status(500).json({
                status: 'error',
                message: err
            })
        }
        else{
            return res.status(200).json({
                status: 'success',
                message: 'Registos encontrados con exito',
                data: response
            })
        }
    }).sort({'date': -1}).limit(6)
}

exports.offer = (req,res) => {
    Model.find({category: req.params.category, offer:true},(err,response) => {
        if(err) {
            return res.status(500).json({
                status: 'error',
                message: err
            })
        }
        else{
            return res.status(200).json({
                status: 'success',
                message: 'Registos encontrados con exito',
                data: response
            })
        }
    })
}
exports.offerall = (req,res) => {
    Model.find({offer:true},(err,response) => {
        if(err) {
            return res.status(500).json({
                status: 'error',
                message: err
            })
        }
        else{
            return res.status(200).json({
                status: 'success',
                message: 'Registos encontrados con exito',
                data: response
            })
        }
    }).sort({'date': -1}).limit(6)
}

exports.family = (req,res) => {
    Model.find({category: req.params.category, family:req.params.family},(err,response) => {
        if(err) {
            return res.status(500).json({
                status: 'error',
                message: err
            })
        }
        else{
            return res.status(200).json({
                status: 'success',
                message: 'Registos encontrados con exito',
                data: response
            })
        }
    })
}

exports.oneProduct = (req,res) => {
    Model.findOne({category: req.params.category, nameUrl:req.params.product},(err,response) => {
        if(err) {
            return res.status(500).json({
                status: 'error',
                message: err
            })
        }
        else{
            return res.status(200).json({
                status: 'success',
                message: 'Registos encontrados con exito',
                data: response,
                //price: format(response.price)
            })
        }
    })
}

exports.search = (req,res) => {
    Model.find({ name: { 
            $regex: req.params.name.toUpperCase(),
            $regex: req.params.name.toLowerCase(),
            $regex: req.params.name.replace(/\b\w/g, function(l){ return l.toUpperCase() })
        } },(err,response) => {
        if(err) {
            return res.status(500).json({
                status: 'error',
                message: err
            })
        }
        else{
            console.log(response)
            if(response == ''){
                return res.status(200).json({
                    status: 'success',
                    index: 0,
                    message: 'Registos encontrados con exito',
                    count: response.length,
                    data: [{name: 'Productos no encontrados'}]
                })
            }else{
                return res.status(200).json({
                    status: 'success',
                    index: 1,
                    message: 'Registos encontrados con exito',
                    count: response.length,
                    data: response
                })
            }
        }
    })
}

exports.transaccion = (req,res) => {

    var num = [];
    for(var i = 0; i <= 102458; i++){
        num.push(i);
    }
    var indice = Math.floor(Math.random()*num.length);
    var number = num[indice];
    

    let buyOrden = num.splice(indice, 1);//Date.now();
    let user = req.body.user;
    let amount = req.body.amount;
    transactions[buyOrden] = { amount: amount};
    let url = 'http://' + req.get('host');


    wp.initTransaction({
        buyOrder: buyOrden,
        sessionId: req.body.user,
        returnURL: url + '/verificar',
        finalURL: url + '/comprobante',
        amount: amount
    }).then((data) => {
        res.status(200).json({url: data.url + '?token_ws=' + data.token})
    })
}

exports.verificar = (req,res) => {
    let token = req.body.token_ws;
    let transaction;

    //console.log('pre token', token);

    wp.getTransactionResult(token).then((transactionResult) => {
        transaction = transactionResult;
       transactions[transaction.buyOrder] = transaction;

        //console.log('transaction', transaction);
       
        //console.log('re acknowledgeTransaction', token)
       return wp.acknowledgeTransaction(token);

    }).then((result2) => {
        console.log('pos acknowledgeTransaction', result2);
        // Si llegas aquí, entonces la transacción fue confirmada.
        // Este es un buen momento para guardar la información y actualizar tus registros (disminuir stock, etc).

        let order = new Transaction({
            date: transaction.transactionDate,
            commerceCode:transaction.detailOutput[0].commerceCode,
            buyOrder: transaction.buyOrder,
            amount: transaction.detailOutput[0].amount,
            authCode: transaction.detailOutput[0].authorizationCode,
            clientId: transaction.sessionId,
            token: token
        })

        order.save((err,response) => {
            if(err){
                console.log(err);
            }else{
                User.findByIdAndUpdate(transaction.sessionId,
                    {$push: {"my_shopping": {
                        transaction: transaction.buyOrder,
                        total: transaction.detailOutput[0].amount,
                        Date: transaction.transactionDate
                    }}},
                    {safe: true, upsert: true},
                    function(err, response2) {
                        if(err) {
                            console.log(err)
                        }
                        else {
                            return res.send(WebPay.getHtmlTransitionPage(transaction.urlRedirection, token));
                            
                        }
                    }
                );
            }
        })
    });
}

exports.comprobante = (req,res) => {
    res.redirect(`http://localhost:3000/#/comprobante/cod/${req.body.token_ws}`)
}

exports.datosCompra = (req,res) => {
    Transaction.findOne({token: req.params.token},(err,response) => {
        if(err){
            console.log(err);
        }else{
            //console.log(response)
           // res.status(200).json(response)
            User.findById({_id: response.clientId},(err,result) => {
                if(err){
                    console.log(err)
                }else{
                    return res.status(200).json({
                        client: result,
                        commerce: response
                    })
                }
            })
        }
    })
}