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
router.post('/product', controller.product.create)
router.put('/product/:id', controller.product.update)
router.delete('/product/:id', controller.product.delete)





module.exports = router;