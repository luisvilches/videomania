const express = require('express');
const router = express.Router();
const controller = require('.././controllers');
const auth = require('../frankify/controllers/auth')


/////////////// Routes  /////////////////////////////

router.get('/', controller.main.index)
router.post('/login', auth.auth)


//categorias

router.get('/category', controller.category.find)
router.post('/category', controller.category.create)
router.put('/category/:id', controller.category.update)
router.delete('/category/:id', controller.category.delete)


// familias

router.get('/family', controller.family.find)
router.post('/family', controller.family.create)
router.put('/family/:id', controller.family.update)
router.delete('/family/:id', controller.family.delete)

// genero

router.get('/gender', controller.gender.find)
router.post('/gender', controller.gender.create)
router.put('/gender/:id', controller.gender.update)
router.delete('/gender/:id', controller.gender.delete)

// productos

router.get('/product', controller.product.find)
router.get('/datoscomercio/:token', controller.product.datosCompra)
router.post('/transaccion', controller.product.transaccion)
router.get('/transacciones', controller.product.transacciones)
router.post('/verificar', controller.product.verificar)
router.post('/comprobante', controller.product.comprobante)
router.get('/product/:name',controller.product.findName)
router.post('/product', controller.product.create)
router.post('/product/gallery/:id', controller.product.addGallery)
router.delete('/product/gallery/one/:id', controller.product.deleteGallery)
router.put('/product/:id', controller.product.update)
router.put('/product/image/:id', controller.product.updateImage)
router.put('/product/premiere/:id', controller.product.premiere)
router.put('/product/offer/:id', controller.product.offer)
router.delete('/product/:id', controller.product.delete)


// banner

router.get('/banner', controller.banners.find)
router.get('/banner/category/:category', controller.banners.findCategory)
router.post('/banner', controller.banners.create)
router.put('/banner/:id', controller.banners.update)
router.delete('/banner/:id', controller.banners.delete)



// banner publicidad

router.get('/bannersPublicidad', controller.bannersPublicidad.find)
router.post('/bannersPublicidad', controller.bannersPublicidad.create)
router.put('/bannersPublicidad/:id', controller.bannersPublicidad.update)
router.delete('/bannersPublicidad/:id', controller.bannersPublicidad.delete)


// advertising

router.get('/advertising', controller.bannersPublicidad.find)
router.post('/advertising', controller.bannersPublicidad.create)
router.put('/advertising/:id', controller.bannersPublicidad.update)
router.delete('/advertising/:id', controller.bannersPublicidad.delete)

// rutas principales del front

router.get('/category/:category', controller.product.findCategory)
router.get('/category/:category/premiere', controller.product.premiere)
router.get('/premiere', controller.product.premiereall)
router.get('/category/:category/offer', controller.product.offer)
router.get('/bannersCategory' , controller.banners.bannersCategory)
router.get('/bannersHome' , controller.bannersPublicidad.bannersHome)
router.get('/offer', controller.product.offerall)
router.get('/category/:category/banner', controller.banners.findOne)
router.get('/category/:category/:family', controller.product.family)
router.get('/products/:category/:product', controller.product.oneProduct)
router.get('/search/:name', controller.product.search)


router.post('/user/cart/:id', controller.users.addToCart)
router.delete('/user/cart/:id', controller.users.deleteToCart)
router.get('/user/cart/total/:id', controller.users.totalCard)


//users

router.get('/users', controller.users.users)
router.post('/users/create', controller.users.createuser)
router.post('/register',controller.users.userRegister)
router.post('/recover',controller.users.recover)
router.get('/user/:id', controller.users.userid)
router.post('/user/findone', controller.users.one)
router.delete('/user/:id', controller.users.delete)
router.put('/user/update/:id',controller.users.update)

module.exports = router;