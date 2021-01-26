var router = require('express').Router()
var controller = require('./controller')

router.post('/', controller.addUser)
router.post('/:userID', controller.getUser)

module.exports = router
