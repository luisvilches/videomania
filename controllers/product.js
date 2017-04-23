//const fileUpload = require('express-fileupload');
const cloudinary = require('cloudinary')
const Model = require('.././models/product');




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
                    priceIva: req.body.price * 1.19,
                    premiere: req.body.premiere,
                    offer: req.body.offer,
                    image: result.secure_url,
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
                let images = result.secure_url;

                Model.findByIdAndUpdate(req.params.id,
                    {$push: {"gallery": {img: images}}},
                    {safe: true, upsert: true},
                    function(err, model) {
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
                                data: model
                            })
                        }
                    }
                );

            

            });
        }
    })
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