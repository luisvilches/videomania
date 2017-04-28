const express = require('express');
const router = express.Router();
const controller = require('.././controllers');
const auth = require('../frankify/controllers/auth')


/////////////// Routes  /////////////////////////////

router.get('/', controller.main.index)
router.post('/authenticate', auth.auth)


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
router.get('/product/:name',controller.product.findName)
router.post('/product', controller.product.create)
router.post('/product/gallery/:id', controller.product.addGallery)
router.put('/product/:id', controller.product.update)
router.put('/product/image/:id', controller.product.updateImage)
router.put('/product/premiere/:id', controller.product.premiere)
router.put('/product/offer/:id', controller.product.offer)
router.delete('/product/:id', controller.product.delete)


// banner

router.get('/banner', controller.banners.find)
router.post('/banner', controller.banners.create)
router.put('/banner/:id', controller.banners.update)
router.delete('/banner/:id', controller.banners.delete)


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
router.get('/offer', controller.product.offerall)
router.get('/category/:category/banner', controller.banners.findOne)
router.get('/category/:category/:family', controller.product.family)
router.get('/products/:category/:product', controller.product.oneProduct)
router.get('/search/:name', controller.product.search)




module.exports = router;