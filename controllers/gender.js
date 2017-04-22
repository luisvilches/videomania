const Model = require('.././models/gender')
const moment = require('moment');


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

    let data = new Model({
        name: req.body.name,
        description: req.body.description,
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
        name: req.body.name,
        description: req.body.description,
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