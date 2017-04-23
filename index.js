'use strict'
//modulos
const frankify = require('./frankify')
const cloudinary = require('cloudinary')
const routes = require('./routes/public')
const routesPrivate = require('./routes/private')
const config = require('./config')


// zona horaria
//process.env.TZ = 'UTC-4';


// use uploads
frankify.upload();

// config cloudinary
cloudinary.config({ 
  cloud_name: 'dowhile', 
  api_key: '379999323567133', 
  api_secret: 'SJ_2PkWm2ISda-R2gDE5KdJR3J4' 
});

//config body-parser
frankify.bodyParserUrl({extended:false});
frankify.bodyParserJson();

//config method-override
frankify.methodOverride('_method')

//config the cors
frankify.cors();

//config static files
frankify.staticFiles('/app')

//function files upload
//frankify.fileUploads({ keepExtensions: true, uploadDir: 'uploads' })

// routes
frankify.routesPublic('/', routes)
frankify.routesPrivates('/app', routesPrivate)

// connection database
frankify.dbConnection(config.db.connection);

// server
frankify.server(config.port);