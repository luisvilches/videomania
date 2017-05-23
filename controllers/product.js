const cloudinary = require('cloudinary')
const Model = require('.././models/product');


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
                    priceIva: req.body.price * 1.19,
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
        priceIva: req.body.price * 1.19,
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
    }).sort({'date': -1}).limit(8)
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
    }).sort({'date': -1}).limit(8)
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
                price: format(response.price)
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