const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const cors = require('cors');
const path = require('path');
const jwt = require('jwt-simple');
const moment = require('moment');
const auth = require('./middlewares/auth');
const config = require('../config');
const fileUpload = require('express-fileupload');

let app = express();

exports.createTokens = (user) => {
    let payload = {
        sub: user._id,
        iat: moment().unix(),
        exp: moment().add(14, 'days').unix(),
        username: user.name,
    };

    return jwt.encode(payload,config.TOKEN_SECRET);
}

exports.dbConnection = (db) => {
    return mongoose.connect(db, err => {
	    if (err) {console.log(err);}
        else{ console.log(`connection database ${db} success`)}
    }) 
}

exports.server = (port) => {
    return app.listen(port , err => {
        if (err) {console.log(err);}

        console.log(`server running in port: ${port}`);
    })
}

exports.use = (arg) =>{
    return app.use(arg);
}

exports.cors = (arg) => {
    return app.use(cors(arg));
}

exports.routesPrivates = (route,fileRoute) => {
    return app.use(route, auth.ensureAuthenticated, fileRoute);
}

exports.routesPublic = (route, fileRoute) => {
    return app.use(route, fileRoute);
}

exports.bodyParserJson = () => {
    return app.use(bodyParser.json())
}
exports.bodyParserUrl = (arg) => {
    return app.use(bodyParser.urlencoded(arg))
}

exports.methodOverride = (method) => {
    return app.use(methodOverride(method))
}

exports.staticFiles = (folder) => {
    app.use(express.static(path.join(__dirname,folder)))
}


exports.upload = () => {
   app.use(fileUpload());
}

//////////////// functions to crud ////////////////////////////////////////////////


exports.find = (model,res) => {
    model.find((err,response) => {
        if(err) {return res.status(500).json({Error: err})}
        return res.status(200).json(response);
    })
}

exports.findById = (model,id,res) => {
     model.findById({_id: id},(err,response) => {
        if(err){return res.status(500).json({Error: err})}

        return res.status(200).json(response)
    })
}

exports.findOne = (model,object,res) => {
    model.findOne(object,(err,response) => {
        if(err) {return res.status(500).json({Error: err})}

        return res.status(200).json(response);
    })
}

exports.create = (model,object,res) => {
    let data = new model(object)
    data.save(err => {
        if(err){return res.status(500).json({Error: err})}

        return res.status(200).json({message: "Usuario creado con exito!"})
    })
}

exports.delete = (model,id,res) => {
    model.remove({_id: id},err => {
      if(err){ return res.status(500).json({Error: err});} 
      return res.status(200).json({message: `Registro ID: ${id} eliminado satisfactoriamente`})
   })
}

exports.update = (model,id,object,res) => {
    let data = new model(object);

	model.update({_id: id},data,(err,response) =>{
		if(err){return res.status(500).json({Error:err})}
        return res.status(200).json(response)
	})	
}