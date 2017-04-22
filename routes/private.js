const express = require('express');
const router = express.Router();
const controller = require('.././controllers');


/////////////// Routes privates /////////////////////////////

router.get('/users', controller.users.users)
router.post('/create', controller.users.createuser)
router.get('/user/:id', controller.users.userid)
router.post('/user/findone', controller.users.one)
router.delete('/user/:id', controller.users.delete)
router.put('/user/update/:id',controller.users.update)

module.exports = router;