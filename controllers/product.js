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
const NodeMailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');

const Url = 'http://www.videomania.cl';

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
    Transaction.findOne({token: req.body.token_ws},(err,response) => {
        if(err){
            console.log(err);
        }else{
            User.findById({_id: response.clientId},(err,result) => {
                if(err){
                    console.log(err)
                }else if(response.authCode === "000000"){
                    res.redirect(Url);
                }else{
                    var arr = [];
                    result.cart.map((item,index) => {
                        Transaction.findByIdAndUpdate(response._id,
                            {$push: {"items": {
                                cant: item.cant,
                                sku: item.sku ,
                                item: item.item,
                                price: item.price
                            }}},
                            {safe: true, upsert: true},
                            function(err, res) {
                                if(err) {
                                    console.log(err)
                                }
                                else {
                                    console.log('ok ' + index);
                                    
                                }
                            }
                        );
                    });
                    setTimeout(function(){
                        Transaction.findOne({token: req.body.token_ws},(errorr,details) => {
                            if(errorr) {console.log(errorr)}
                            else{
                                console.log(details.items)
                                ordenCompra(response.buyOrder,response.authCode,response.clientId,response.amount,details.items);
                                correoCliente(result.name,result.mail,response.buyOrder,response.authCode,response.amount,details.items);
                                User.update({_id: response.clientId},{ $set: { cart: [] }},(err,carts) => {
                                    console.log(response.clientId, carts);
                                })
                            }
                        })
                    },5000);
                    if(!req.body.token_ws == 'undefined' || req.body.token_ws == '' || req.body.token_ws == null){
                        res.redirect(Url);
                    }else{
                        res.redirect(`${Url}/#/comprobante/cod/${req.body.token_ws}`);
                    }
                }
            })
        }
    })
}

exports.datosCompra = (req,res) => {
    Transaction.findOne({token: req.params.token},(err,response) => {
        if(err){
            console.log(err);
        }else{
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

exports.transacciones = (req,res) => {
    Transaction.find((err,response) => {
        if(err){
            console.log('transaction error: '+err)
            return res.status(500).json({
                state: 'error',
                message: err,
                data: []
            })
        }else{
            return res.status(200).json({
                state: 'success',
                message: 'Operacion realizada con exito',
                data: response
            })
        }
    })
}

function correoCliente(usuario,mail,comercio,auth,total,arr){
    var details = arr.map((item) => {
        return `<tr>
            <td style="height: 36px;"><p style="color:#000080; font-size:14px; font-weight:200;">${item.item}</p></td>
            <td style="text-align: center; font-size:14px; font-weight:200; height: 36px;">${item.cant}</td>
            <td style="text-align: right; font-size:14px; font-weight:200; height: 36px;">$${item.price}</td>
        </tr>`
    }).join('');

    let template = `
        <!--DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd" -->
        <html xmlns="http://www.w3.org/1999/xhtml" style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">

        <head>
        <meta name="viewport" content="width=device-width" />
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <title>Alerts e.g. approaching your limit</title>


        <style type="text/css">
            img {
            max-width: 100%;
            }
            body {
            -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: none; width: 100% !important; height: 100%; line-height: 1.6em;
            }
            body {
            background-color: #f6f6f6;
            }
            @media only screen and (max-width: 640px) {
            body {
                padding: 0 !important;
            }
            h1 {
                font-weight: 800 !important; margin: 20px 0 5px !important;
            }
            h2 {
                font-weight: 800 !important; margin: 20px 0 5px !important;
            }
            h3 {
                font-weight: 800 !important; margin: 20px 0 5px !important;
            }
            h4 {
                font-weight: 800 !important; margin: 20px 0 5px !important;
            }
            h1 {
                font-size: 22px !important;
            }
            h2 {
                font-size: 18px !important;
            }
            h3 {
                font-size: 16px !important;
            }
            .container {
                padding: 0 !important; width: 100% !important;
            }
            .content {
                padding: 0 !important;
            }
            .content-wrap {
                padding: 10px !important;
            }
            .invoice {
                width: 100% !important;
            }
            }
        </style>
        </head>

        <body itemscope itemtype="http://schema.org/EmailMessage" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: none; width: 100% !important; height: 100%; line-height: 1.6em; background-color: #f6f6f6; margin: 0;"
        bgcolor="#f6f6f6">

        <table class="body-wrap" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; width: 100%; background-color: #f6f6f6; margin: 0;" bgcolor="#f6f6f6">
            <tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
            <td style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0;" valign="top"></td>
            <td class="container" width="600" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; display: block !important; max-width: 600px !important; clear: both !important; margin: 0 auto;"
            valign="top">
                <div class="content" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; max-width: 600px; display: block; margin: 0 auto; padding: 20px;">
                <table class="main" width="100%" cellpadding="0" cellspacing="0" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; border-radius: 3px; background-color: #fff; margin: 0; border: 1px solid #e9e9e9;"
                bgcolor="#fff">
                    <tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                    <td class="alert alert-warning" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 16px; vertical-align: top; color: #fff; font-weight: 500; text-align: center; border-radius: 3px 3px 0 0; background-color: #E41F2C; margin: 0; padding: 20px;"
                    align="center" bgcolor="#FF9F00" valign="top">
                        <img src="http://oi67.tinypic.com/246wehw.jpg" />
                    </td>
                    </tr>
                    <tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                    <td class="content-wrap" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 20px;" valign="top">
                        <table width="100%" cellpadding="0" cellspacing="0" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                        <tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                            <td class="content-block" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;" valign="top">
                            Estimado/a <strong style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">${usuario}</strong>.
                            </td>
                        </tr>
                        <tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                            <td class="content-block" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;" valign="top">
                            <b>Gracias por su compra</b>
                            </td>
                        </tr>
                        <tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                            <td class="content-block" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;" valign="top">
                            Nos pondremos en contacto con usted nuevamente cuando enviemos su(s) producto(s), la fecha estimada se indica a continuación.
                            </td>
                        </tr>
                        <tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                            <td class="content-block" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;" valign="top">
                            <b>Fecha de entrega:</b> 3 a 7 días habiles.
                            </td>
                        </tr>
                        <tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                            <td class="content-block" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;" valign="top">
                            <b>Codigo de transacción:</b> ${comercio}
                            </td>
                        </tr>
                        <tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                            <td class="content-block" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;" valign="top">
                            <b>Codigo de autorización:</b> ${auth}
                            </td>
                        </tr>
                        <tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                            <td class="content-block" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;" valign="top">
                            <b>Detalle de productos:</b><br/>
                                <table cellspacing="0" style=" width: 100%; margin-top: 15px; padding: 10px; border-radius: 4px; overflow: hidden;">
                                    <tbody>
                                        <tr>
                                            <td style="padding: 0 0 5px 0; width:40%; border-bottom: 1px solid #ccc; font-weight: 600; height: 36px;">Producto</td>
                                            <td style="padding: 0 0 5px 0; width:15%; border-bottom: 1px solid #ccc; text-align: center; font-weight: 600; height: 36px;">Cant</td>
                                            <td style="padding: 0 0 5px 0; width:15%; border-bottom: 1px solid #ccc; text-align: right; font-weight: 600; height: 36px;">Precio</td>
                                        </tr>
                                        ${details}
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                        <tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                            <td class="content-block" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;" valign="top">
                            <h2><b>Total de la compra:</b> $${total}</h2>
                            </td>
                        </tr>
                        <tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                            <td class="content-block" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;" valign="top">
                            <b>Gracias por su compra de parte de todo el equipo de Videomanias.cl</b>
                            </td>
                        </tr>
                        </table>
                    </td>
                    </tr>
                </table>
                <div class="footer" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; width: 100%; clear: both; color: #999; margin: 0; padding: 20px;">
                    <table width="100%" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                    <tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                        <td class="aligncenter content-block" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 12px; vertical-align: top; color: #999; text-align: center; margin: 0; padding: 0 0 20px;" align="center"
                        valign="top">
                        Copyright 2017 - <a href="http://www.videomanias.cl" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 12px; color: #999; text-decoration: underline; margin: 0;">videomanias.cl</a>. Todos los derechos reservados.</td>
                    </tr>
                    </table>
                </div>
                </div>
            </td>
            <td style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0;" valign="top"></td>
            </tr>
        </table>
        </body>
        </html>
    `

    let mailOptions = {
        from: 'Videomanias.cl',
        to: mail,
        subject: 'Confirmacion compra Videomanias.cl',
        html: template
    };

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
    } else {
        console.log("Email sent");
    }})
}

function ordenCompra(comercio,auth,cliente,total,arr){
   var details = arr.map((item) => {
        return `<tr>
            <td style="height: 36px;"><p style="color:#000080; font-size:14px; font-weight:200;">${item.item}</p></td>
            <td style="text-align: center; font-size:14px; font-weight:200; height: 36px;">${item.cant}</td>
            <td style="text-align: right; font-size:14px; font-weight:200; height: 36px;">${item.price}</td>
        </tr>`
    }).join('');

    var template = `<section>
            <br><h3>Estimado administrador</h3><br>
            <p>Una nueva transacción de compra fue relializada desde su portal Videomanias.cl</p>
            <br>
            <h4>Codigo de transacción: <b>${comercio}</b></h4>
            <h4>Codigo de autorización: <b>${auth}</b></h4>
            <h4>Codigo de cliente: <b>${cliente}</b></h4>
            <br/>
            <h2>Productos:</h2>
            <table cellspacing="0" style=" width: 100%; margin-top: 15px; padding: 10px; border-radius: 4px; overflow: hidden;">
                <tbody>
                    <tr>
                        <td style="padding: 0 0 5px 0; width:40%; border-bottom: 1px solid #ccc; font-weight: 600; height: 36px;">Producto</td>
                        <td style="padding: 0 0 5px 0; width:15%; border-bottom: 1px solid #ccc; text-align: center; font-weight: 600; height: 36px;">Cant</td>
                        <td style="padding: 0 0 5px 0; width:15%; border-bottom: 1px solid #ccc; text-align: right; font-weight: 600; height: 36px;">Precio</td>
                    </tr>
                    ${details}
                </tbody>
            </table>
        <br>
        <h2>Monto total: <b>$${total}</b></h2>
        <br>
        <h3><b>Atte. Videomanias.cl</b></h3>
    </section>`;

    let mailOptions = {
        from: 'Videomanias.cl',
        to: 'luis@dowhile.cl',
        subject: 'Nueva transacción desde Videomanias.cl',
        html: template
    };

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
    } else {
        console.log("Email sent");
    }})
}
