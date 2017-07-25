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
  cloud_name: 'dbdsxkhtp', 
  api_key: '722923292138612', 
  api_secret: 'h1cwtjEXDkPWZzwQCOZVG2wpnOw' 
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
