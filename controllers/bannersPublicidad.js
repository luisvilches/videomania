const cloudinary = require('cloudinary')
const Model = require('.././models/bannersPublicidad');

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

exports.findOne = (req,res) => {
     Model.findOne({category: req.params.category},(err,response) => {
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
                    category: req.body.category,
                    img: result.secure_url,
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
                    img: result.secure_url,
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



exports.bannersHome = (req,res) => {
    Model.findRandom({}, {}, {count: 2}, function(err, results) {
        if (err){
            return res.status(500).json({
                status: 'error',
                message: err
            })
        }
        else {
            return res.status(200).json({
                status: 'success',
                message: 'Registos encontrados con exito',
                data: results
            })
        }
    })
}