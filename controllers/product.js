const express = require('express');
const app = express();
const fileUpload = require('express-fileupload');
const Model = require('.././models/product');
app.use(fileUpload())


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
                data: response 
            }
        )}
    })
}


exports.create = (req,res) => {

    console.log(req.files)

    /*let data = new Model({
        sku: req.body.sku,
        category: req.body.category,
        family: req.body.family,
        gender: req.body.gender,
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        priceIva: req.body.price * 19 / 100,
        premiere: req.body.premiere,
        offer: req.body.offer,
        image: req.files.image,
        media: req.body.media,
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
    })*/
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

    let data = new Model({
        _id: req.params.id,
        sku: req.body.sku,
        category: req.body.category,
        family: req.body.family,
        gender: req.body.gender,
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        priceIva: req.body.price * 19 / 100,
        premiere: req.body.premiere,
        offer: req.body.offer,
        image: req.body.image,
        media: req.body.media,
        dateCreate: new Date(),
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